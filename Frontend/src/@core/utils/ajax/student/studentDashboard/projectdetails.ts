//get project details
export async function projectdetails() {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/student/dashboard`, {
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

//faculty id
export async function fetchFacultyID() {
  try {
    const localToken: string | null = localStorage.getItem('token')
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/faculty/available`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localToken}`,
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
    return { success: false, message: e }
  }
}

type CreateProjectProps = {
  title: string
  description: string
  faucltyID: string
  projectType: string
  semester: string
  frontendTechnologies: string
  backendTechnologies: string
  database: string
  company: string
  companyEmail: string
  capacity: string
}

//create project
export async function createProject({
  title,
  description,
  faucltyID,
  projectType,
  semester,
  frontendTechnologies,
  backendTechnologies,
  database,
  company,
  companyEmail,
  capacity
}: CreateProjectProps) {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`, {
      method: 'POST',
      body: JSON.stringify({
        title: title,
        description: description,
        faculty_id: faucltyID,
        project_type: projectType,
        semester: semester,
        frontendTechnologies: frontendTechnologies,
        backendTechnologies: backendTechnologies,
        database: database,
        company: company,
        company_email: companyEmail,
        capacity: capacity
      }),
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

type JoinProjectsProps = {
  inviteCode: string
}

//join project
export async function joinProject({ inviteCode }: JoinProjectsProps) {
  try {
    const token: string | null = localStorage.getItem('token')
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/join/`, {
      method: 'POST',
      body: JSON.stringify({ invite_code: inviteCode }),
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    const json = await response.json()
    if (json.status === `success`) {
      console.log(json)

      return json
    } else {
      console.log(json)
      console.log('join project')

      return json
    }
  } catch (e) {
    alert(e)

    return { success: false, message: e }
  }
}

type deleteProjectProps = {
  id: string
}

// delete project if the user is leader
export async function deleteProject({ id }: deleteProjectProps) {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/projects/${id}`, {
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
