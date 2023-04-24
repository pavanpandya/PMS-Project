//get groups
export async function getGroups() {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/student/group`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    const json = await response.json()
    if (json.token) {
      console.log(json)

      return json
    } else {
      console.log(json)

      return json
    }
  } catch (e) {
    alert(e)

    return { success: false, message: e }
  }
}

//delete member from group
type DeleteMemberProps = {
  memberId: string
}

export async function deleteMember({ memberId }: DeleteMemberProps) {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/remove/${memberId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    const json = await response.json()
    if (json.token) {
      console.log(json)

      return json
    } else {
      console.log(json)

      return json
    }
  } catch (e) {
    alert(e)

    return { success: false, message: e }
  }
}
