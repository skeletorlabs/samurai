import Notification from '../components/notificate'

type ErrorProps = {
  e: any
  notificate?: boolean
}

export default function handleError({ e, notificate = false }: ErrorProps) {
  let error = e.message

  let title: string = "Transaction failure"

  if (e?.code?.toString() === 'ACTION_REJECTED' && notificate) {
    error = 'Action dismissed by user'
  }

  if (e?.code === "INSUFFICIENT_FUNDS" && notificate) {
    error = 'Insufficient funds'
  }

  if (e?.message.includes("Pausable: paused")) {
    error = 'Minting is paused'
  }

  if (notificate) {
    Notification({
      type: 'error',
      title: title,
      message: error as string,
      link: '',
    })
  }

  return e?.code?.toString()
}
