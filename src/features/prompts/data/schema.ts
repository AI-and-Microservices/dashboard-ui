import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
/**
 * name: { type: String, required: true },
    key: { type: String, default: '' }, // optional: only used for system prompt
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    type: {
        type: String,
        enum: [PROMPT_TYPE.ROLE, PROMPT_TYPE.SYSTEM, PROMPT_TYPE.TEMPLATE, PROMPT_TYPE.APP],
        default: PROMPT_TYPE.ROLE
    },
    referenceType: {
        type: String,
        enum: ['', 'role', 'function', 'app'],
        default: ''
    },
    referenceId: { type: String, default: '' },
    isPublic: { type: Boolean, default: false },
    status: {
        type: String,
        enum: [STATUS.ACTIVE, STATUS.INACTIVE],
        default: STATUS.ACTIVE
    }

 */
export const promptSchema = z.object({
  _id: z.string(),
  name: z.string(),
  key: z.string(),
  userId: z.string(),
  content: z.string(),
  type: z.enum(['role', 'system', 'template', 'app']),
  referenceType: z.enum(['', 'role', 'function', 'app']),
  referenceId: z.string(),
  isPublic: z.boolean(),
  status: z.enum(['active', 'inactive']),
})

export type Prompt = z.infer<typeof promptSchema>
