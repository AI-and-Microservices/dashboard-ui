import { AxiosError } from 'axios'
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useAuthStore } from '@/stores/authStore'
import { handleServerError } from '@/utils/handle-server-error'
import { FontProvider } from './context/font-context'
import { ThemeProvider } from './context/theme-context'
import './index.css'
// Generated Routes
import { routeTree } from './routeTree.gen'
import MediaLibrary from '@/components/media-library'

const refreshToken = async () => {
    await useAuthStore.getState().getNewToken(onRefreshTokenError)
}

const onRefreshTokenError = () => {
    // logout and show signin screen
    useAuthStore.getState().logout()
    const redirect = `${router.history.location.href}`
    router.navigate({ to: '/sign-in', search: { redirect } })
}

const queryClient = new QueryClient({
  defaultOptions: {
    
    queries: {
      retry: (failureCount, error) => {
        // eslint-disable-next-line no-console
        if (import.meta.env.DEV) console.log({ failureCount, error })

        if (failureCount >= 0 && import.meta.env.DEV) return false
        if (failureCount > 3 && import.meta.env.PROD) return false
        if (error instanceof AxiosError && error.response?.status === 401) {
            if (error.response?.data?.message === "Token has expired") {
                refreshToken()
            }
            toast.error('Content not modified!')
        }
        return !(
          error instanceof AxiosError &&
          [401, 403].includes(error.response?.status ?? 0)
        )
      },
      refetchOnWindowFocus: import.meta.env.PROD,
      staleTime: 10 * 1000, // 10s
    },
    mutations: {
      onError: async (error) => {
        handleServerError(error)

        if (error instanceof AxiosError) {
          if (error.response?.status === 304) {
            toast.error('Content not modified!')
          }
          if (error.response?.status === 401) {
            if (error.response?.data?.message === "Token has expired") {
                await refreshToken()
                
            }
          }
        }
      },
    //   retry: 3
    },
  },
  queryCache: new QueryCache({
    onError: async (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
            if (error.response?.data?.message === "Token has expired") {
                await refreshToken()
            }
        //   useAuthStore.getState().logout()
        //   const redirect = `${router.history.location.href}`
        //   router.navigate({ to: '/sign-in', search: { redirect } })
        }
        if (error.response?.status === 500) {
          toast.error('Internal Server Error!')
          router.navigate({ to: '/500' })
        }
        if (error.response?.status === 403) {
          // router.navigate("/forbidden", { replace: true });
        }
      }
    },
  }),
})

// Create a new router instance
const router = createRouter({
  routeTree,
  context: { queryClient, auth: undefined! },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const App = () => {
    const auth = useAuthStore()
    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
            <FontProvider>
              <RouterProvider router={router} context={{auth}} />
              <MediaLibrary />
            </FontProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </GoogleOAuthProvider>
    )
}

export default App