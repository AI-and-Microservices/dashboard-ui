import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { GoogleLogin } from '@react-oauth/google'
import { useAuthStore } from '@/stores/authStore'

type UserAuthFormProps = HTMLAttributes<HTMLFormElement>

export function UserAuthForm({ className }: UserAuthFormProps) {
  const {googleVerify} = useAuthStore()
  // const search = useSearch({strict: false})
  // const navigation = useNavigate()
  return (
    <div
      className={cn('grid gap-3', className)}
    >
      <div className='relative my-2'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-background text-muted-foreground px-2'>
            Sign-In with
          </span>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-2'>
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
              const {credential} = credentialResponse
              if (credential) {
                await googleVerify(credential)
                // console.log(search)
                // navigation({to: '/'})
              }
          }}
          onError={() => {
              // eslint-disable-next-line no-console
              console.log('Login Failed');
          }}
        />
        
      </div>
    </div>
  )
}
