//get list

export async function getKanban() {
  try {
    const token: string | null = localStorage.getItem('token')
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/board`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    const json = await response.json()
    if (json.success) {
      console.log(json)

      return json
    } else {
      return json
    }
  } catch (e) {
    return { success: false, message: e }
  }
}

//add card
