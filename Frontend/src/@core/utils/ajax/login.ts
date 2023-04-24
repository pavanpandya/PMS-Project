type Props = {
  email: string
  password: string
}
export async function login({ email, password }: Props) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/login`, {
      method: 'POST',
      body: JSON.stringify({
        email,
        password
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const json = await response.json()

    console.log(response)
    if (json.token) {
      localStorage.setItem('token', json.token)
      localStorage.setItem('role', json.role)
      localStorage.setItem('email', json.email)
      localStorage.setItem('id', json.userId)
      localStorage.setItem('hhjklmno-hjsohjso-toKeN', 'login success')
      localStorage.setItem('username', json.userId)
      localStorage.setItem('projectRejected', json.rejected)
      localStorage.setItem('projectId', json.projectId)

      return { success: true, message: json }
    } else {
      // console.log(json)

      return json
    }
  } catch (e) {
    return { success: false, message: e }
  }
}
