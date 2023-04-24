//get submission
export async function getSubmissionLink() {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/submit/submission`, {
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
type updateSubmiissionProps = {
  updateRepositorylink: string
  updatePresentationlink: string
  updateReportlink: string
}

//update submission
export async function updateSubmissionLink({
  updateRepositorylink,
  updatePresentationlink,
  updateReportlink
}: updateSubmiissionProps) {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/submit/submission`, {
      method: 'PUT',
      body: JSON.stringify({
        repository_link: updateRepositorylink,
        presentation_link: updatePresentationlink,
        report_link: updateReportlink
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

type uploadSubmissionLinks = {
  uploadRepositorylinks: string
  uploadPresentationlinks: string
  uploadReportlinks: string
}

//upload submission
export async function uploadSubmissionLinks({
  uploadRepositorylinks,
  uploadPresentationlinks,
  uploadReportlinks
}: uploadSubmissionLinks) {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/submit/submission`, {
      method: 'POST',
      body: JSON.stringify({
        repository_link: uploadRepositorylinks,
        presentation_link: uploadPresentationlinks,
        report_link: uploadReportlinks
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
