//get details
export async function getDashboardData() {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/faculty/dashboard`, {
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
