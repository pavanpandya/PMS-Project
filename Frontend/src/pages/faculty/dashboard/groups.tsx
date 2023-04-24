import { useState, useEffect } from 'react'
import LinearProgress from '@mui/material/LinearProgress'
import * as React from 'react'
import Modal from '@mui/material/Modal'
import { styled } from '@mui/material/styles'
import { Card, Input } from '@mui/material'
import ReactiveButton from 'reactive-button'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material'

export default function Groups() {
  const [groups, setGroups] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const [commentText, setCommentText] = useState('')
  const [projectId, setProjectId] = useState('')
  const [comments, setComments] = useState([])
  const [showCommentBox, setCommentBox] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const [studentTable, setStudentTable] = useState([])
  const [selectedSemester, setSelectedSemester] = useState(localStorage.getItem('selectedSemester')) // default to show all groups
  const handleSemesterChange = (event: { target: { value: React.SetStateAction<string | null> } }) => {
    setSelectedSemester(event.target.value)
  }

  const filteredGroups = Object.entries(groups)

    .filter(([_, group]) => selectedSemester === 'All' || group.semester === selectedSemester)
    .map(([key, group]) => (
      <li key={key}>
        {loading ? (
          <></>
        ) : (
          <div>
            <div
              key={group._id}
              className='text-black rounded-lg shadow-lg cursor-pointer p-4 hover:shadow-xl transition-all duration-300'
              onClick={() => handleClick(group)}
              style={{ marginBottom: '1rem', backgroundColor: '#e3f2fd' }}
            >
              <h2 className=' text-lg font-bold mb-2'>Group Name : {group.groupName}</h2>
              <p className=' text-sm mb-1'>Group Title{group.title}</p>
              <p className=' text-sm mb-1'>Group description : {group.description}</p>
              <p className=' text-sm mb-1'>Group Leader : {group.leader.name}</p>
              <hr />
            </div>
          </div>
        )}
      </li>
    ))

  // Check if any groups were found for the selected semester
  const noDataFound = filteredGroups.length === 0 && selectedSemester !== 'All'

  const maxComments = 3
  let token: string | null
  if (typeof window !== 'undefined') {
    // Perform localStorage action
    token = localStorage.getItem('token')
  }
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    height: 900,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    borderRadius: 1,
    p: 4,
    overflow: 'scroll'
  }

  const handleClose = () => {
    setSelectedGroup(null)
    setCommentBox(false)
  }

  //project details
  const fetchDetails = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/faculty/groups`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      console.log(data)
      const groupsArray = Object.keys(data).map(key => data[key])
      setGroups(groupsArray)

      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchDetails()
  }, [])

  const handleClick = (group: React.SetStateAction<null>) => {
    setSelectedGroup(group)
    setProjectId(group._id)

    // console.log(group._id);
    setStudentTable(group.students)
    console.log(studentTable)
    console.log('clicked')
  }
  const handleShowMore = () => {
    setShowAll(true)
  }

  const handleCloseCommentBox = () => {
    setCommentBox(false)
  }

  // send comment
  const handleComment = async () => {
    console.log(commentText)
    try {
      console.log(projectId)
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
      const data = await response.json()
      console.log(data)
      getAllComments()
      setCommentText('')
      toast.success('Comment  Added Successfully', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      })
      console.log('Success')
    } catch (error) {
      getAllComments()
      toast.error('Error While Sending Comment', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      })
      console.error(error)
    }
  }

  //get all comments
  const getAllComments = async () => {
    try {
      setCommentBox(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectId}/comments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      const data = await response.json()
      console.log(data)
      setComments(data)
      if (data) {
      }
    } catch (error) {
      console.error(error)
    }
  }

  //handle delete comment
  const handleCommentDelete = async (commentId: any) => {
    try {
      console.log(commentId)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/projects/comment/${projectId}/${commentId}/`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      )
      const data = await response.json()
      console.log(data)
      getAllComments()
      toast.success('Comment  Deleted Successfully', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      })
    } catch (error) {
      getAllComments()
      toast.error('Error While Deleting Comment', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      })
      console.error(error)
    }
  }
  const filteredComments = Array.isArray(comments) ? comments.filter(comment => comment.text !== '') : []

  //handle delete member
  const handleDeleteMember = async (studentId: any) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/faculty/removeStudentFromGroup${projectId}/${studentId}/`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      )
      const data = await response.json()
      console.log(data)
      getAllComments()
      toast.success('Member  Deleted Successfully', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      })
    } catch (error) {
      getAllComments()
      toast.error('Error While Deleting Member', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      })
      console.error(error)
    }
  }

  const Div = styled('div')(({ theme }) => ({
    ...theme.typography.button,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
    color: 'blue',
    fontWeight: 'bold',
    textDecoration: 'underline'
  }))

  return (
    <Card sx={{ padding: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        <FormControl sx={{ minWidth: 120, mr: 2 }}>
          <InputLabel id='semester-select-label'>Select a semester:</InputLabel>
          <Select
            labelId='semester-select-label'
            id='semester-select'
            value={selectedSemester}
            onChange={handleSemesterChange}
            label='Select a semester'
          >
            <MenuItem value='All'>All</MenuItem>
            <MenuItem value='Semester6'>Semester 6</MenuItem>
            <MenuItem value='Semester7'>Semester 7</MenuItem>
            <MenuItem value='Semester8'>Semester 8</MenuItem>
            {/* add more options as needed */}
          </Select>
        </FormControl>
        {/* add your other components here */}
      </Box>
      <br></br>

      <div>
        {noDataFound && groups.length ? (
          <>
            {toast.warning(' No Group for Selected Semester', {
              position: 'top-right',
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined
            })}
          </>
        ) : (
          <ul>{filteredGroups}</ul>
        )}
      </div>
      <br></br>
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

      <>
        {loading ? (
          <>
            <LinearProgress />
          </>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 '>
            <>{groups.length === 0 ? <div>No Groups Yet</div> : <></>}</>
            <div>
              <Modal
                open={selectedGroup}
                onClose={handleClose}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
              >
                <Box sx={style}>
                  {selectedGroup && (
                    <>
                      <Card className='p-4 rounded-lg shadow-lg'>
                        <p className=' font-bold text-lg mb-1'>{selectedGroup.groupName}</p>
                        <p className=' text-md mb-1'>Title : {selectedGroup.title}</p>
                        <p className=' text-md mb-4'>Description : {selectedGroup.description}</p>
                        <p className=' text-md mb-4'>Backend Technologies : {selectedGroup.backendTechnologies}</p>
                        <p className=' text-md mb-4'>Frontend Technologies : {selectedGroup.frontendTechnologies}</p>
                        <p className=' text-md mb-4'>Database : {selectedGroup.database}</p>
                        <p className=' text-md mb-4'>Leader : {selectedGroup.leader.name}</p>
                        <p className=' text-md mb-4'>Project type : {selectedGroup.project_type}</p>
                        <p className=' text-md mb-4'>Semester : {selectedGroup.semester}</p>
                        {selectedGroup.project_type === 'UDP (User Defined Project)' ? (
                          <></>
                        ) : (
                          <>
                            <p className=' text-md mb-4'>Company : {selectedGroup.company}</p>
                            <p className=' text-md mb-4'>Company Email : {selectedGroup.company_email}</p>
                          </>
                        )}

                        <p className=' text-md mb-4'>
                          Project Status :<p className='text-red-500'>{selectedGroup.status}</p>
                        </p>

                        <p className=' text-md mb-4'>
                          Invite Code :<p className='text-red-500'>{selectedGroup.invite_code}</p>
                        </p>
                      </Card>
                      <br></br>

                      <div>
                        <div>
                          {showCommentBox ? (
                            <div className='comment-section'>
                              <br></br>
                              {filteredComments.length === 0 ? (
                                <Div>{'No comments yet : '}</Div>
                              ) : (
                                <div
                                  className=' rounded-lg shadow-xl p-4'
                                  style={{
                                    height: '300px',
                                    overflow: 'auto'
                                  }}
                                >
                                  <br></br>
                                  <Div>{'All Comments : '}</Div>
                                  {filteredComments
                                    .slice(0, showAll ? filteredComments.length : maxComments)
                                    .map(comment => (
                                      <div key={comment._id} className='my-4'>
                                        <p className='font-bold'>{comment.text}</p>
                                        <div className='flex justify-between items-center mt-4'>
                                          <p className='text-sm  text-red-500 italic '>{comment.name}</p>
                                          <p className='text-sm '>{new Date(comment.date).toLocaleString()}</p>
                                          {comment.email === localStorage.getItem('email') && (
                                            <ReactiveButton
                                              onClick={() => handleCommentDelete(comment._id)}
                                              color='red'
                                              idleText='Delete'
                                              loadingText='Loading'
                                              successText='Done'
                                              rounded={true}
                                              shadow
                                            />
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              )}
                              <br></br>
                              <div className='text-right'>
                                {!showAll && filteredComments.length > maxComments && (
                                  <>
                                    <ReactiveButton
                                      onClick={handleShowMore}
                                      color='violet'
                                      idleText=' Show More'
                                      loadingText='Loading'
                                      successText='Done'
                                      rounded={true}
                                      shadow
                                    />
                                  </>
                                )}

                                <ReactiveButton
                                  onClick={handleCloseCommentBox}
                                  color='green'
                                  idleText=' Close'
                                  loadingText='Loading'
                                  successText='Done'
                                  rounded={true}
                                  shadow
                                />
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className='p-4 text-right'>
                                <ReactiveButton
                                  onClick={getAllComments}
                                  color='violet'
                                  idleText=' Show Comments'
                                  loadingText='Loading'
                                  successText='Done'
                                  rounded={true}
                                  shadow
                                />
                                <br></br>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <br></br>
                      {/* {selectedGroup.leader.name === studentTable.email && ( */}
                      <table className='table-auto w-full rounded-lg shadow-xl'>
                        <thead>
                          <tr>
                            <th className='px-4 py-2'>Name</th>
                            <th className='px-4 py-2'>Email</th>
                            <th className='px-4 py-2'>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {studentTable.map(student => (
                            <tr key={student.id}>
                              <td className='border px-4 py-2'>{student.name}</td>
                              <td className='border px-4 py-2'>{student.email}</td>
                              <td className='border px-4 py-2'>
                                <ReactiveButton
                                  onClick={() => handleDeleteMember(student.id)}
                                  color='red'
                                  idleText='Delete'
                                  loadingText='Loading'
                                  successText='Done'
                                  rounded={true}
                                  shadow
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* )} */}
                      <br></br>
                      <br></br>
                      <div className=' rounded-lg shadow-xl '>
                        <label htmlFor='message' className='block font-medium mb-2 p-4'>
                          Enter your message:
                        </label>
                        <div className='p-4'>
                          <input
                            placeholder='Enter your Comments'
                            id='message'
                            name='message'
                            className='border border-gray-300 rounded-md p-4 w-full h-32 mb-4'
                            onChange={event => setCommentText(event.target.value)}
                          ></input>
                        </div>

                        <div className='p-4'>
                          <div className='text-right'>
                            <ReactiveButton
                              onClick={handleComment}
                              color='violet'
                              idleText=' Send'
                              loadingText='Loading'
                              successText='Done'
                              rounded={true}
                              shadow
                            />
                          </div>
                        </div>
                      </div>
                      <br></br>
                    </>
                  )}
                </Box>
              </Modal>
            </div>
          </div>
        )}
      </>
    </Card>
  )
}
