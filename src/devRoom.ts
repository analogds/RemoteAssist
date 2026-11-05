/**
 * Local UI work only: `VITE_ASSIST_DEV_ROOM=msc-support npm run dev` skips the sign-in gate, which
 * can never pass on localhost, and joins that room on the local LiveKit server started by
 * scripts/dev-room.sh. Always empty in production builds.
 */
export const assistDevRoom: string = import.meta.env.DEV ? (import.meta.env.VITE_ASSIST_DEV_ROOM ?? '') : ''
