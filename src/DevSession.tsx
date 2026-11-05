import { devAssistGrant } from './devGrant'
import Session from './Session'

export default function DevSession() {
  return <Session getGrant={() => devAssistGrant()} />
}
