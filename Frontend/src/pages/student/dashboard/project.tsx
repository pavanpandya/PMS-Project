import { Button, Card, Input } from '@mui/material'
import React, { useState, useEffect } from 'react'
import Comments from '../../../@core/components/comments/comments'
import ReactiveButton from 'reactive-button'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import LinearProgress from '@mui/material/LinearProgress'
import { getProjectDetails } from 'src/@core/utils/ajax/student/studentComments/project'
import { useRouter } from 'next/router'

interface MyObject {
  title: string
  description: string
  project_isApproved: string
  project_status: string
  semester: string
  capacity: string
  company: string
  project_type: string
  invite_code: string
  leader_email: string
  _id: string
}

function StudentProject() {
  const [userData, setUserData] = useState<MyObject[]>([])
  const [leaderEmail, setLeaderEmail] = useState('')
  const [projectId, setProjectId] = useState('')
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  let AssinedProject
  if (typeof window !== 'undefined') {
    AssinedProject = localStorage.getItem('projectIsAssigned')
  }

  let user_Id
  if (typeof window !== 'undefined') {
    // Perform localStorage action

    user_Id = localStorage.getItem('email')
  }

  //update project
  async function handleSubmit(event: { preventDefault: () => void; target: HTMLFormElement | undefined }) {
    event.preventDefault()

    const formData = new FormData(event.target)
    const token: string | null = localStorage.getItem('token')
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectId}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: formData.get('title'),
          description: formData.get('description'),
          project_status: formData.get('status'),
          repository_link: formData.get('repositoryLink'),
          report_link: formData.get('reportLink'),
          frontendTechnologies: formData.get('frontendTechnologies'),
          backendTechnologies: formData.get('backendTechnologies'),
          database: formData.get('database'),
          presentation_link: formData.get('presentationLink'),
          groupName: formData.get('groupName'),
          company: formData.get('company'),
          company_email: formData.get('companyEmail')
        }),
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (response.status == 200) {
        toast.success('Project Updated Successfully', {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        })
        setOpen(false)
        fetchDetails()
        console.log('updated')
      } else {
        toast.error('Error While Updating Project', {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        })
        throw new Error(`Failed to update project. Status: ${response.status}`)
      }
    } catch (error) {
      alert('Project update failed' + error)
      console.error(error)
    }
  }

  //delete project
  async function handleDelete(projectId: any) {
    console.log(projectId)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const json = await response.json()
      console.log(json)
      router.push('/student/dashboard/home/')

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
    } finally {
      router.push('/student/dashboard/home')
    }
  }

  //project details
  useEffect(() => {
    fetchDetails()
  }, [])
  const fetchDetails = async () => {
    try {
      const data = await getProjectDetails()
      console.log(data)
      setUserData(data)
      setLeaderEmail(data.leader_email)
      setProjectId(data._id)
    } catch (error) {
      console.error(error)
    }
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      {AssinedProject === 'no' ? (
        <Card sx={{ padding: 4 }}>
          Procject no created yet
          <Button onClick={() => router.push('/student/dashboard/home')}>Back to Home</Button>
        </Card>
      ) : (
        <>
          {' '}
          <Card>
            {userData.length === 0 ? (
              <Box sx={{ width: '100%' }}>
                <LinearProgress />
              </Box>
            ) : (
              <div className='w-full  p-10'>
                <Card>
                  <div className=' rounded-lg shadow-xl  p-8 flex-grow '>
                    <h1 className='font-bold text-xl mb-2 pb-2'>Project Details</h1>
                    {userData.length === 0 ? (
                      <div>Project not created yet</div>
                    ) : (
                      <div>
                        <div className='mb-2'>
                          <strong>Title : </strong>
                          {userData.title}
                        </div>
                        <div className='mb-2'>
                          <strong>Description : </strong>
                          {userData.description}
                        </div>
                        <div className='mb-2'>
                          <div className='flex'>
                            <strong>Project Log : </strong>

                            <div className='mb-2'>{userData.project_isApproved}</div>

                            <div>No Data</div>
                          </div>
                        </div>
                        <div className='mb-2'>
                          <strong>Project Status : </strong>
                          {userData.status}
                        </div>
                        <div className='mb-2'>
                          <strong>Semester : </strong>
                          {userData.semester}
                        </div>
                        <div className='mb-2'>
                          <strong>Total Capacity : </strong>
                          {userData.capacity}
                        </div>
                        <div className='mb-2'>
                          <strong>Company : </strong>
                          {userData.company}
                        </div>
                        <div className='mb-2'>
                          <strong>Project Type : </strong>
                          {userData.project_type}
                        </div>

                        {user_Id === leaderEmail && (
                          <div className='mb-2 ' style={{ color: '#2979ff' }}>
                            <strong>Invite Code : </strong>
                            {userData.invite_code}
                          </div>
                        )}
                        <div className='text-right'>
                          {user_Id === leaderEmail && (
                            <>
                              <ReactiveButton
                                onClick={handleClickOpen}
                                color='viloet'
                                idleText='Update Project'
                                loadingText='Loading'
                                successText='Done'
                                rounded={true}
                                shadow
                                type='submit'
                              />
                              <ReactiveButton
                                onClick={() => handleDelete(projectId)}
                                color='red'
                                idleText='Delete Project'
                                loadingText='Loading'
                                successText='Done'
                                rounded={true}
                                shadow
                                type='submit'
                              />
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
                <br></br>

                <Dialog open={open} onClose={handleClose}>
                  <DialogTitle>Optional sizes</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      {user_Id === leaderEmail ? (
                        <>
                          <form onSubmit={handleSubmit} className=' mx-auto'>
                            <div className='mb-4 flex'>
                              <div className='mr-4 flex-1'>
                                <label htmlFor='title' className='block mb-2 font-bold'>
                                  Title:
                                </label>
                                <Input
                                  type='text'
                                  id='title'
                                  name='title'
                                  placeholder={userData.title}
                                  required
                                  className='w-full px-3 py-2 border rounded-md'
                                />
                              </div>
                              <div className='mr-4 flex-1'>
                                <label htmlFor='description' className='block mb-2 font-bold'>
                                  Description:
                                </label>
                                <Input
                                  type='text'
                                  id='description'
                                  name='description'
                                  placeholder={userData.description}
                                  required
                                  className='w-full px-3 py-2 border rounded-md'
                                ></Input>
                              </div>
                            </div>
                            <div className='mb-4 flex'>
                              <div className='mr-4 flex-1 bg-transparent'>
                                <label htmlFor='status' className='block mb-2 font-bold'>
                                  Status:
                                </label>
                                <select
                                  id='status'
                                  name='status'
                                  required
                                  className='w-full border bg-transparent  rounded-md  p-4'
                                >
                                  <option className='bg-transparent text-black' value=''>
                                    -- Select Status --
                                  </option>
                                  <option className='bg-transparent text-black' value='active'>
                                    Active
                                  </option>
                                  <option className='bg-transparent text-black' value='inactive'>
                                    Inactive
                                  </option>
                                </select>
                              </div>

                              <div className='mr-4 flex-1'>
                                <label htmlFor='repositoryLink' className='block mb-2 font-bold'>
                                  Repository Link:
                                </label>
                                <Input
                                  type='text'
                                  id='repositoryLink'
                                  name='repositoryLink'
                                  placeholder={userData.repository_link}
                                  required
                                  className='w-full px-3 py-2 border rounded-md'
                                />
                              </div>
                            </div>
                            <div className='mb-4 flex'>
                              <div className='mr-4 flex-1'>
                                <label htmlFor='reportLink' className='block mb-2 font-bold'>
                                  Report Link:
                                </label>
                                <Input
                                  type='text'
                                  id='reportLink'
                                  name='reportLink'
                                  placeholder={userData.report_link}
                                  required
                                  className='w-full px-3 py-2 border rounded-md'
                                />
                              </div>

                              <div className='mr-4 flex-1'>
                                <label htmlFor='frontendTechnologies' className='block mb-2 font-bold'>
                                  Frontend Technologies:
                                </label>
                                <Input
                                  type='text'
                                  id='frontendTechnologies'
                                  name='frontendTechnologies'
                                  placeholder={userData.frontendTechnologies}
                                  required
                                  className='w-full px-3 py-2 border rounded-md'
                                />
                              </div>
                            </div>
                            <div className='mb-4 flex'>
                              <div className='mr-4 flex-1'>
                                <label htmlFor='backendTechnologies' className='block mb-2 font-bold'>
                                  Backend Technologies:
                                </label>
                                <Input
                                  type='text'
                                  id='backendTechnologies'
                                  name='backendTechnologies'
                                  placeholder={userData.backendTechnologies}
                                  required
                                  className='w-full px-3 py-2 border rounded-md'
                                />
                              </div>

                              <div className='mr-4 flex-1'>
                                <label htmlFor='database' className='block mb-2 font-bold'>
                                  Database:
                                </label>
                                <Input
                                  type='text'
                                  id='database'
                                  name='database'
                                  placeholder={userData.database}
                                  required
                                  className='w-full px-3 py-2 border rounded-md'
                                />
                              </div>
                            </div>
                            <div className='mb-4 flex'>
                              <div className='mr-4 flex-1'>
                                <label htmlFor='presentationLink' className='block mb-2 font-bold'>
                                  Presentation Link:
                                </label>
                                <Input
                                  type='text'
                                  id='presentationLink'
                                  name='presentationLink'
                                  placeholder={userData.presentation_link}
                                  required
                                  className='w-full px-3 py-2 border rounded-md'
                                />
                              </div>

                              <div className='mr-4 flex-1'>
                                <label htmlFor='groupName' className='block mb-2 font-bold'>
                                  Group Name:
                                </label>
                                <Input
                                  type='text'
                                  id='groupName'
                                  name='groupName'
                                  placeholder={userData.groupName}
                                  required
                                  className='w-full px-3 py-2 border rounded-md'
                                />
                              </div>
                            </div>
                            {userData.project_type === 'UDP (User Defined Project)' ? (
                              <></>
                            ) : (
                              <div className='mb-4 flex'>
                                <div className='mr-4 flex-1'>
                                  <label htmlFor='company' className='block mb-2 font-bold'>
                                    Company:
                                  </label>
                                  <Input
                                    type='text'
                                    id='company'
                                    placeholder={userData.company}
                                    required
                                    className='w-full px-3 py-2 border rounded-md'
                                  />
                                </div>
                                <div className='mr-4 flex-1'>
                                  <label htmlFor='companyEmail' className='block mb-2 font-bold'>
                                    Company Email:
                                  </label>
                                  <Input
                                    type='text'
                                    id='companyEmail'
                                    placeholder={userData.companyEmail}
                                    required
                                    className='w-full px-3 py-2 border rounded-md'
                                  />
                                </div>
                              </div>
                            )}

                            <ReactiveButton
                              color='violet'
                              idleText='Submit'
                              loadingText='Loading'
                              successText='Done'
                              rounded={true}
                              shadow
                              type='submit'
                            />
                          </form>
                        </>
                      ) : (
                        <></>
                      )}
                    </DialogContentText>
                    <Box
                      noValidate
                      component='form'
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        m: 'auto',
                        width: 'fit-content'
                      }}
                    ></Box>
                  </DialogContent>
                  <DialogActions>
                    <ReactiveButton
                      onClick={handleClose}
                      color='red'
                      idleText='Close'
                      loadingText='Loading'
                      successText='Done'
                      rounded={true}
                      shadow
                      type='submit'
                    />
                  </DialogActions>
                </Dialog>

                <br></br>

                {userData.length === 0 ? <></> : <Comments />}
              </div>
            )}
            <ToastContainer
              position='top-right'
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />

            {/* Same as */}
            <ToastContainer />
          </Card>
        </>
      )}
    </>
  )
}

export default StudentProject
