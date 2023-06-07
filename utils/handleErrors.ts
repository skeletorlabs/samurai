import Notification from '../components/notificate'

type ErrorProps = {
  e: any
  notificate?: boolean
}

export default function handleError({ e, notificate = false }: ErrorProps) {
  console.log(e?.code?.toString())

  if (e?.code?.toString() === 'ACTION_REJECTED' && notificate) {
    Notification({
      type: 'error',
      title: 'Transaction failure',
      message: 'Action Dismissed by user',
      link: '',
    })

    return e.code.toString()
  }

  if (e?.code?.toString() === '-32603' && notificate) {
    Notification({
      type: 'error',
      title: 'Transaction failure',
      message: 'Insufficient balance',
      link: '',
    })

    return e?.code?.toString()
  }

  if (e?.code === "INSUFFICIENT_FUNDS" && notificate) {
    console.log("entrou")
    Notification({
      type: 'error',
      title: 'Transaction failure',
      message: 'Insufficient funds',
      link: '',
    })

    return e.code.toString()
  }

  let error = e.message

  if (e && e?.error && e?.error?.logs) {
    const log = e?.error?.logs?.find((logError: string) =>
      logError.includes('Error Number:'),
    )
    const errorNumber = log.substring(
      log.indexOf('Error Number:') + 13,
      log.indexOf('Error Message:') - 2,
    )

    const errorMessage = log.substring(
      log.indexOf('Error Message:') + 14,
      log.length,
    )
    error = `Error: ${errorNumber} - ${errorMessage}`
  }

  if (notificate) {
    Notification({
      type: 'error',
      title: 'Transaction failure',
      message: error as string,
      link: '',
    })
  }

  console.log("ERRORRRRRRR=======>") 
  console.log(e.code)
  return e?.code?.toString()
}
