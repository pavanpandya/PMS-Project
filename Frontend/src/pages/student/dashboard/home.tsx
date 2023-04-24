import { Button, Card, FormControl, InputLabel, MenuItem, Select } from '@mui/material'

import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import TextField from '@mui/material/TextField'
import LinearProgress from '@mui/material/LinearProgress'
import ReactiveButton from 'reactive-button'
import { Editor } from '@tinymce/tinymce-react'
import { toast, ToastContainer } from 'react-toastify'
import { useRouter } from 'next/router'

//api calls
import {
  createProject,
  fetchFacultyID,
  joinProject,
  projectdetails
} from 'src/@core/utils/ajax/student/studentDashboard/projectdetails'

function ProjectDetails() {
  const [userData, setUserData] = useState([])
  const [inviteCode, setInviteCode] = useState('')
  const [semester, setSemester] = useState('')
  const [title, setTitle] = useState('')
  const [projectType, setProjectType] = useState('')
  const [description, setDescription] = useState('')
  const [frontendTechnologies, setFrontendTechnologies] = useState('')
  const [backendTechnologies, setBackendTechnologies] = useState('')
  const [capacity, setCapacity] = useState('')
  const [company, setCompany] = useState('')
  const [companyEmail, setCompanyEmail] = useState('')
  const [database, setDatabase] = useState('')
  const [openJoinModal, setOpenJoinModal] = React.useState(false)
  const handleOpenJoinModal = () => setOpenJoinModal(true)
  const handleCloseJoinModal = () => setOpenJoinModal(false)
  const [openCreateModal, setOpenCreateModal] = React.useState(false)
  const handleOpenCreateProModal = () => setOpenCreateModal(true)
  const handleCloseCreateProModal = () => setOpenCreateModal(false)
  const [facultyList, setFacultyList] = useState([])
  const [faucltyID, setFacultyID] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [isProjectAssigned, setIsProjectAssigned] = useState(false)
  const [editorContent, setEditorContent] = useState('')
  const router = useRouter()
  let user_Email
  if (typeof window !== 'undefined') {
    // Perform localStorage action
    user_Email = localStorage.getItem('email')
  }

  let isProjectRejected: boolean | null | undefined | string
  if (typeof window !== 'undefined') {
    // Perform localStorage action
    isProjectRejected = localStorage.getItem('projectRejected')
  }

  let ProjectId: string | null
  if (typeof window !== 'undefined') {
    // Perform localStorage action
    ProjectId = localStorage.getItem('projectId')
  }

  const styles = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    height: 700,
    bgcolor: 'background.paper',
    border: '2px solid rgba(0, 0, 0, 0)',
    boxShadow: 24,
    p: 4,
    overflow: 'scroll',
    borderRadius: 1
  }

  const styleInvite = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 350,
    height: 240,
    borderRadius: 1,
    bgcolor: 'background.paper',
    border: '2px solid rgba(0, 0, 0, 0)',
    boxShadow: 24
  }

  //fetch faculty list
  useEffect(() => {
    const fetchFacultyId = async () => {
      try {
        setIsLoading(true)
        const data = await fetchFacultyID()
        setFacultyList(data)
        setIsLoading(false)
      } catch (error) {
        console.error(error)
        setIsLoading(false)
      }
    }
    fetchFacultyId()
  }, [])

  //project details
  const fetchDetails = async () => {
    try {
      setLoading(true)
      const data = await projectdetails()
      console.log(data)
      if (data.msg === 'You do not have any projects') {
        setIsProjectAssigned(false)
        console.log(data.msg)
        localStorage.setItem('projectIsAssigned', 'no')
        setLoading(false)
      } else {
        setUserData(data)
        setIsProjectAssigned(true)
        console.log(data)
        localStorage.setItem('projectIsAssigned', 'yes')
        setLoading(false)
        localStorage.setItem('projectId', data.projectId)
      }
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchDetails()
  }, [])

  //create project
  const createProjectCall = async () => {
    handleCloseCreateProModal()
    setOpenCreateModal(false)

    try {
      const data = await createProject({
        semester,
        title,
        projectType,
        description,
        frontendTechnologies,
        backendTechnologies,
        capacity,
        company,
        companyEmail,
        database,
        faucltyID
      })
      if (data.status === 200) {
        console.log(data)
        console.log('project created')
        fetchDetails()
        handleCloseCreateProModal()
        setOpenCreateModal(false)
        location.reload()
      }
      handleCloseCreateProModal()
      setOpenCreateModal(false)
      fetchDetails()
      alert('project created')
      location.reload()
    } catch (error) {
      console.error(error)
      alert('project not created please try again')
      fetchDetails()
    }
  }

  {
    /*join project*/
  }
  const joinProjectCall = async () => {
    try {
      setOpenJoinModal(false)
      const data = await joinProject({
        inviteCode
      })
      if (data.msg === 'Invite code is invalid') {
        alert('invalid invite code')
      } else {
        alert('joined')
      }
      console.log(data)
      fetchDetails()
    } catch (error) {
      console.error(error)
      fetchDetails()
    }
  }
  const handleInviteCode = (event: { target: { value: React.SetStateAction<string> } }) => {
    setInviteCode(event.target.value)
  }
  const handletitle = (event: { target: { value: React.SetStateAction<string> } }) => {
    setTitle(event.target.value)
  }

  const handleproject_type = (event: { target: { value: React.SetStateAction<string> } }) => {
    setProjectType(event.target.value)
  }
  const handleSemester = (event: { target: { value: React.SetStateAction<string> } }) => {
    setSemester(event.target.value)
  }
  const handlefrontendTechnologies = (event: { target: { value: React.SetStateAction<string> } }) => {
    setFrontendTechnologies(event.target.value)
  }
  const handlebackendTechnologies = (event: { target: { value: React.SetStateAction<string> } }) => {
    setBackendTechnologies(event.target.value)
  }
  const handledatabase = (event: { target: { value: React.SetStateAction<string> } }) => {
    setDatabase(event.target.value)
  }
  const handlecompany = (event: { target: { value: React.SetStateAction<string> } }) => {
    setCompany(event.target.value)
  }
  const handlecompany_email = (event: { target: { value: React.SetStateAction<string> } }) => {
    setCompanyEmail(event.target.value)
  }
  const handlecapacity = (event: { target: { value: React.SetStateAction<string> } }) => {
    setCapacity(event.target.value)
  }

  // dropdown logic to select id and set into selectedID state or veriable to send to backend
  const handleSelect = (event: { target: { value: any } }) => {
    const selectedId = Object.keys(facultyList).find(id => facultyList[id].name === event.target.value)
    setFacultyID(selectedId)
    console.log(selectedId)
  }

  const handleEditorChange = (content, editor) => {
    const plainText = content.replace(/(<([^>]+)>)/gi, '')
    setEditorContent(content)
    setDescription(plainText)
  }

  async function handleDeleteProject(projectId: any) {
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
      router.push('pages/login/')

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

  return (
    <>
      {isProjectRejected === 'yes' ? (
        <>
          <Card sx={{ padding: 4 }}>
            Project is Rejected by faculty please Delete the project and create new one
            <Button onClick={() => handleDeleteProject(ProjectId)} variant='contained' color='error'>
              Delete project
            </Button>
          </Card>
        </>
      ) : (
        <>
          <Card sx={{ padding: 8 }}>
            {loading ? (
              <Box sx={{ width: '100%' }}>
                <LinearProgress />
              </Box>
            ) : (
              <div>
                {/* invite code   */}
                {userData.leaderEmail === user_Email && (
                  <div className=' p-4 rounded-lg'>
                    <div className='text-right'>
                      <span className='font-bold underline '>Invite Code: {userData.invite_code}</span>
                    </div>
                  </div>
                )}

                {/* Dashboard project details card */}
                <Card>
                  <div className=' rounded-lg shadow-md  p-4 flex-grow text-left'>
                    <h1 className='font-bold text-xl mb-2 pb-2 text-left'>Project Details</h1>

                    <br></br>
                    {userData.length === 0 ? (
                      <div className='text-left'>
                        <div>Project Not Created Yet</div>
                        <br></br>
                        <Box sx={{ display: 'flex' }}>
                          <Box sx={{ padding: 2 }}>
                            <ReactiveButton
                              onClick={handleOpenCreateProModal}
                              color='violet'
                              idleText='Create Project'
                              loadingText='Loading'
                              successText='Done'
                              rounded={true}
                              shadow
                            />
                          </Box>

                          <Box sx={{ padding: 2 }}>
                            <ReactiveButton
                              onClick={handleOpenJoinModal}
                              color='yellow'
                              idleText='Join Project'
                              loadingText='Loading'
                              successText='Done'
                              rounded={true}
                              shadow
                            />
                          </Box>
                        </Box>
                        <br></br>
                      </div>
                    ) : (
                      <div>
                        <div className='mb-2 text-left'>
                          <strong>Title : </strong>
                          {userData.projectTitle}
                        </div>

                        <div className='mb-2 text-left'>
                          <strong>Description : </strong>
                          {userData.projectDescription}
                        </div>

                        <div className='mb-2 text-left'>
                          <div className='flex'>
                            <strong>Project Log : </strong>
                            {userData.length === 0 ? (
                              <div className='mb-2'>{userData.project_isApproved}</div>
                            ) : (
                              <div>No Data</div>
                            )}
                          </div>
                        </div>
                        <div className='mb-2 text-left'>
                          <strong>Project Status : </strong>
                          {userData.project_status}
                        </div>
                        <div className='mb-2 text-left'>
                          <strong>Total Members : </strong>
                          {userData.totalMembers}
                        </div>
                        {projectType === 'IDP (Industry Defined Project)' && (
                          <div className='flex'>
                            <strong>Company : </strong>
                            {userData.project_company === '' ? (
                              <div className='mb-2'>No Company</div>
                            ) : (
                              <div>{userData.project_company}</div>
                            )}
                          </div>
                        )}
                        <div className='flex'>
                          <strong>Comments : </strong>
                          {userData.length === 0 ? (
                            <div className='mb-2'>{userData.project_comments}</div>
                          ) : (
                            <div> No comments yet</div>
                          )}
                        </div>
                        <div className='mb-2 text-left'>
                          <strong>Project Type : </strong>
                          {userData.project_type}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Dashboard Group member  card */}
                <br></br>
                <br></br>
                {isProjectAssigned === false ? (
                  <></>
                ) : (
                  <Card className=' rounded-lg shadow-md  flex-grow '>
                    <div className='p-4 '>
                      <div className='font-bold text-xl mb-2'>Group Members</div>
                      <div className=' font-semibold mb-2'>
                        {userData.groupMembers.map(
                          (
                            member:
                              | boolean
                              | React.ReactChild
                              | React.ReactFragment
                              | React.ReactPortal
                              | null
                              | undefined,
                            index: React.Key | null | undefined
                          ) => (
                            <div key={index}>
                              {index + 1}. {member}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </Card>
                )}

                <br></br>
                <br></br>

                {/* Dashboard Mentor card */}
                {isProjectAssigned === false ? (
                  <></>
                ) : (
                  <Card className=' rounded-lg shadow-md  p-4 flex-grow '>
                    <strong className='font-bold text-xl mb-2'>Mentor</strong>
                    {userData.length === 0 ? (
                      <div>No mentor assigned</div>
                    ) : (
                      <div>
                        <br />
                        <div className=' font-bold text-xl'>{userData.facultyName}</div>
                        <div className=' font-semibold mb-2'>{userData.facultyEmail}</div>
                        <div className=' font-semibold mb-2'>{userData.facultyPhone}</div>
                      </div>
                    )}
                  </Card>
                )}

                {/* Dashboard Leader card */}
                <br></br>
                <br></br>
                {isProjectAssigned === false ? (
                  <></>
                ) : (
                  <Card className=' rounded-lg shadow-md  p-4 flex-grow '>
                    <strong className='font-bold text-xl mb-2'>Leader</strong>
                    {userData.length === 0 ? (
                      <div>No Data </div>
                    ) : (
                      <div>
                        <br />
                        <div className=' font-bold text-xl'>{userData.leaderName}</div>
                        <div className='font-semibold mb-2'>{userData.leaderEmail}</div>
                      </div>
                    )}
                  </Card>
                )}

                <Modal
                  open={openCreateModal}
                  onClose={handleCloseCreateProModal}
                  aria-labelledby='modal-modal-title'
                  aria-describedby='modal-modal-description'
                >
                  <Box sx={styles}>
                    <div className='p-4'>
                      <strong>Project Details</strong>
                    </div>
                    <br></br>
                    <div>
                      <InputLabel>Title</InputLabel>
                      <FormControl fullWidth>
                        <TextField required id='outlined-required' onChange={handletitle} />
                      </FormControl>
                      <br></br>
                      <br></br>
                      <div>
                        <InputLabel>Description</InputLabel>
                        <>
                          <Editor
                            value={editorContent}
                            onEditorChange={handleEditorChange}
                            init={{
                              branding: false,
                              height: 300,
                              menubar: false,
                              plugins: [
                                'advlist autolink lists link image charmap print preview anchor',
                                'searchreplace visualblocks code fullscreen',
                                'insertdatetime media table paste code help wordcount'
                              ],
                              toolbar:
                                'undo redo | formatselect | bold italic backcolor | \
            alignleft aligncenter alignright alignjustify | \
            bullist numlist outdent indent | removeformat | help'
                            }}
                            onchange={handleEditorChange}
                          />
                        </>
                      </div>
                      <br></br>
                      <InputLabel>Select a faculty:</InputLabel>
                      <div>
                        {isLoading ? (
                          <p>Loading...</p>
                        ) : (
                          <FormControl fullWidth>
                            <Select id='dropdown' onChange={handleSelect}>
                              <InputLabel id='demo-simple-select-label'>Select a Faculty</InputLabel>
                              {Object.keys(facultyList).map(id => (
                                <MenuItem key={id} value={facultyList[id].name}>
                                  {facultyList[id].name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                        {/* {selectedName && <p>Selected name: {selectedName}</p>} */}
                      </div>
                      <br></br>

                      <InputLabel>Project Type</InputLabel>
                      <FormControl fullWidth>
                        <Select onChange={handleproject_type}>
                          <InputLabel id='demo-simple-select-label'>Select a Poject</InputLabel>
                          <MenuItem value='IDP (Industry Defined Project)'>IDP (Industry Defined Project)</MenuItem>
                          <MenuItem value='UDP (User Defined Project)'>UDP (User Defined Project)</MenuItem>
                        </Select>
                      </FormControl>
                      {projectType === 'IDP (Industry Defined Project)' && (
                        <>
                          <br></br>
                          <br></br>
                          <InputLabel>Company</InputLabel>
                          <FormControl fullWidth>
                            <TextField required id='outlined-required' onChange={handlecompany} />
                          </FormControl>
                          <br></br>
                          <InputLabel>Company Email</InputLabel>
                          <FormControl fullWidth>
                            <TextField required id='outlined-required' onChange={handlecompany_email} />
                          </FormControl>
                        </>
                      )}
                      <br></br>
                      <br></br>
                      <InputLabel>Semester </InputLabel>
                      <FormControl fullWidth>
                        <Select onChange={handleSemester}>
                          <InputLabel id='demo-simple-select-label'>Select a Semester</InputLabel>
                          <MenuItem value='6'>6th Semester</MenuItem>
                          <MenuItem value='7'>7th Semester</MenuItem>
                          <MenuItem value='8'>8Th Semester</MenuItem>
                        </Select>
                      </FormControl>
                      <br></br>
                      <br></br>
                      <InputLabel>Frontend Technologies</InputLabel>
                      <FormControl fullWidth>
                        <TextField required id='outlined-required' onChange={handlefrontendTechnologies} />
                      </FormControl>
                      <br></br>
                      <br></br>
                      <InputLabel>Backend Technologies</InputLabel>
                      <FormControl fullWidth>
                        <TextField required id='outlined-required' onChange={handlebackendTechnologies} />
                      </FormControl>
                      <br></br>
                      <br></br>
                      <InputLabel>Database</InputLabel>
                      <FormControl fullWidth>
                        <TextField required id='outlined-required' onChange={handledatabase} />
                      </FormControl>
                      <br></br>
                      <br></br>
                      <InputLabel>Capacity</InputLabel>
                      <FormControl fullWidth>
                        <Select id='capacity' name='capacity' onChange={handlecapacity} required>
                          <InputLabel id='demo-simple-select-label'>Select a Capacity</InputLabel>
                          <MenuItem value='1'>1</MenuItem>
                          <MenuItem value='2'>2</MenuItem>
                          <MenuItem value='3'>3</MenuItem>
                          <MenuItem value='4'>4</MenuItem>
                        </Select>
                      </FormControl>
                      <br></br>
                      <br></br>
                      <div className='text-right'>
                        <ReactiveButton
                          onClick={createProjectCall}
                          color='violet'
                          idleText='Create Project'
                          loadingText='Loading'
                          successText='Done'
                          rounded={true}
                          shadow
                        />
                      </div>
                    </div>
                  </Box>
                </Modal>
              </div>
            )}
            <Modal
              open={openJoinModal}
              onClose={handleCloseJoinModal}
              aria-labelledby='modal-modal-title'
              aria-describedby='modal-modal-description'
            >
              <Box sx={styleInvite}>
                <div className='p-4'>
                  <div className='text-right p-2'></div>
                  <div className='p-4 font-bold'>Enter Invite Code</div>
                  <div className='flex'>
                    <TextField required id='outlined-required' onChange={handleInviteCode} className='p-4' />
                    <Box sx={{ padding: 2 }}>
                      <ReactiveButton
                        onClick={joinProjectCall}
                        color='primary'
                        idleText='JOIN'
                        loadingText='Loading'
                        successText='Done'
                        rounded={true}
                        shadow
                      />
                    </Box>
                  </div>
                </div>
              </Box>
            </Modal>
          </Card>
        </>
      )}
    </>
  )
}

export default ProjectDetails
