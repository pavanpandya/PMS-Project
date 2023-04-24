// get all comments
type Props = {
  projectId: string
}

export async function getAllComments({ projectId }: Props) {
  try {
    const token: string | null = localStorage.getItem('token')
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectId}/comments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
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

//get project Id
export async function getProjectId() {
  try {
    const token: string | null = localStorage.getItem('token')
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/student/projectid`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
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

type DeleteCommentProps = {
  projectId: string
  commentId: string
}

//delete comment
export async function deleteComment({ projectId, commentId }: DeleteCommentProps) {
  try {
    const token: string | null = localStorage.getItem('token')
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/comment/${projectId}/${commentId}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
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

type CreateCommentProps = {
  projectId: string
  commentText: string
}

//send comment
export async function sendComment({ projectId, commentText }: CreateCommentProps) {
  try {
    const token: string | null = localStorage.getItem('token')
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/comment/${projectId}`, {
      method: 'POST',
      body: JSON.stringify({
        text: commentText
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
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
