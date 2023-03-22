import { BASE_API_URL } from '@/utils/constants'
import { Project } from '@/utils/interfaces'

export default async function fetchProjects() {
  const url = BASE_API_URL + '/projects'
  const response = await fetch(url)
  const json = await response.json()

  return json.result as Project[]
}
