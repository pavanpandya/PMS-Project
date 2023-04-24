import React, { useState, useEffect } from 'react'
import { Cards } from 'antd'
import LinearProgress from '@mui/material/LinearProgress'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import { Card, Input, Typography } from '@mui/material'
import ReactiveButton from 'reactive-button'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: 1
}
const Requests = () => {
  const [inputValue, setInputValue] = useState('')
  const [projectId, setProjectId] = useState('')
  const [requestData, setRequestData] = useState([])
  const [showPopup, setShowPopup] = useState(false)
  const [selectedRequestId, setSelectedRequestId] = useState(null)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [showRejectPopup, setShowRejectPopup] = useState(false)
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  let token: string | null
  if (typeof window !== 'undefined') {
    // Perform localStorage action
    token = localStorage.getItem('token')
  }

  // get all requests
  const getAllRequests = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/faculty/requests`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      const data = await response.json()
      console.log(data)
      const requestArray = Object.keys(data).map(key => data[key])
      setRequestData(requestArray)

      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  useEffect(() => {
    getAllRequests()
  }, [])

  // handle reject
  const handleReject = async (id: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/reject/${id}`, {
        method: 'POST',
        body: JSON.stringify({
          comments: inputValue
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      const data = await response.json()
      console.log(data)
      toast.success('Rejected Successfully', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      })
      setShowRejectPopup(false)
      setInputValue('')
      localStorage.setItem('projectRejected', true)
    } catch (error) {
      toast.error('Error ', {
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

  // handle approve
  const handleApproved = async (id: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/approve/${id}`, {
        method: 'POST',
        body: JSON.stringify({
          comments: inputValue
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      const data = await response.json()
      console.log(data)
      toast.success('Successfully Approved ', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      })
      setShowPopup(false)
      setInputValue('')
      localStorage.setItem('projectRejected', 'no')
    } catch (error) {
      toast.error('Error ', {
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

  const handleCardClick = (id: React.SetStateAction<string> | React.SetStateAction<null>) => {
    setSelectedRequestId(id)
    setShowPopup(true)
    setProjectId(id)

    handleOpen(true)
  }

  const handleRejectClick = () => {
    setShowPopup(false)
    setShowRejectPopup(true)
  }

  const handleInputChange = (event: { target: { value: React.SetStateAction<string> } }) => {
    setInputValue(event.target.value)

    // console.log(inputValue);
  }

  return (
    <>
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
      <Card sx={{ padding: 8 }}>
        {loading ? (
          <Box sx={{ width: '100%' }}>
            <LinearProgress />
          </Box>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {requestData && requestData.length > 0 ? (
              requestData.map(request => (
                <div key={request.projectId}>
                  <Card
                    onClick={() => handleCardClick(request.projectId)}
                    style={{
                      padding: '10px'
                    }}
                  >
                    <div className='p-2'>
                      <Typography>Project : {request.project}</Typography>
                      <Typography>Description : {request.description}</Typography>
                      <Typography>Database: {request.database}</Typography>
                      <Typography>Backend Technologies: {request.backendTechnologies}</Typography>
                      <Typography>Frontend Technologies: {request.frontendTechnologies}</Typography>
                      <Typography>Leader Name: {request.leaderName}</Typography>
                      <Typography>Leader Name: {request.projectType}</Typography>
                    </div>
                  </Card>
                </div>
              ))
            ) : (
              <p className='text-red-500'>There are no requests to show</p>
            )}
            {showPopup && selectedRequestId && (
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
              >
                <Box sx={style}>
                  <div>
                    <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
                      <h3 className='text-lg leading-6 font-medium ' id='modal-headline'>
                        Comment
                      </h3>
                      <Box></Box>
                      <div className='mt-2'>
                        <div className='mt-4 flex justify-end'>
                          <div className='mr-4'>
                            <ReactiveButton
                              onClick={() => handleApproved(projectId)}
                              color='violet'
                              idleText='Approve project'
                              loadingText='Loading'
                              successText='Done'
                              rounded={true}
                              shadow
                            />
                          </div>

                          <ReactiveButton
                            onClick={() => setStatus('reject')}
                            color='red'
                            idleText='Reject project'
                            loadingText='Loading'
                            successText='Done'
                            rounded={true}
                            shadow
                          />
                        </div>
                        {status === 'reject' && (
                          <div className='mt-4 '>
                            <div className='pt-8'>
                              <Input
                                type='text'
                                className='border border-gray-300 rounded-md w-full px-3 py-2'
                                placeholder='Reason for rejection'
                                value={inputValue}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                            <div className='text-right p-4 '>
                              <ReactiveButton
                                onClick={() => handleReject(projectId)}
                                color='violet'
                                idleText='Reject '
                                loadingText='Loading'
                                successText='Done'
                                rounded={true}
                                shadow
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Box>
              </Modal>
            )}
          </div>
        )}
        <div></div>
      </Card>
    </>
  )
}

export default Requests
