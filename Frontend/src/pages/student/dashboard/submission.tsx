/* eslint-disable react-hooks/rules-of-hooks */
import { Button, Card, Input } from '@mui/material'
import React, { useState, useEffect } from 'react'
import ReactiveButton from 'reactive-button'
import {
  getSubmissionLink,
  updateSubmissionLink,
  uploadSubmissionLinks
} from 'src/@core/utils/ajax/student/studentSubmission/submission'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { useRouter } from 'next/router'

function index() {
  const [submission, setSubmission] = useState([])
  const [updateRepositorylink, setUpdateRepositorylink] = useState('')
  const [updatePresentationlink, setUpdatePresentationlink] = useState('')
  const [updateReportlink, setUpdateReportlink] = useState('')
  const [uploadRepositorylink, setUploadRepositorylink] = useState('')
  const [uploadPresentationlink, setUploadPresentationlink] = useState('')
  const [uploadReportlink, setUploadReportlink] = useState('')
  const [showUploadLink, setShowUploadLink] = useState(true)
  const [showButton, setShowButton] = useState(true)

  let AssinedProject
  if (typeof window !== 'undefined') {
    AssinedProject = localStorage.getItem('projectIsAssigned')
  }
  const router = useRouter()
  const handleClick = () => {
    // Perform data update logic here
    setShowButton(false)
    console.log('Data updated!')
    setShowUploadLink(false)
  }
  const handleClose = () => {
    // Perform data update logic here
    setShowButton(true)
    setShowUploadLink(true)
  }
  let token: string | null
  if (typeof window !== 'undefined') {
    // Perform localStorage action
    token = localStorage.getItem('token')
  }
  useEffect(() => {
    getSubmission()
  }, [])

  // get links
  const getSubmission = async () => {
    try {
      const data = await getSubmissionLink()
      console.log(data)
      setSubmission(data)
    } catch (error) {
      console.error(error)
    }
  }

  // upload links
  const uploadLinks = async () => {
    try {
      const data = await uploadSubmissionLinks({ uploadPresentationlink, uploadRepositorylink, uploadReportlink })
      toast.success('Link Uploaded Successfully', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      })
      console.log(data)
    } catch (error) {
      toast.error('Error While Uploading Links', {
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

  // update links
  const updateLinks = async () => {
    try {
      const data = await updateSubmissionLink({ updatePresentationlink, updateRepositorylink, updateReportlink })
      toast.success('Link Updated Successfully', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      })
      console.log(data)
    } catch (error) {
      toast.error('Error While Updating Links', {
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

  return (
    <>
      {AssinedProject === 'no' ? (
        <Card sx={{ padding: 4 }}>
          Procject no created yet
          <Button onClick={() => router.push('/student/dashboard/home')}>Back to Home</Button>
        </Card>
      ) : (
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
            {/* GET Submission view */}
            <div className=' rounded-lg shadow-md p-4'>
              <h1 className='text-2xl font-bold mb-4'>Submission Links:</h1>

              <div className='flex flex-wrap justify-center'>
                <div className=' rounded-lg shadow-md p-4 mr-4 mb-4'>
                  <h1 className='text-xl font-bold mb-4'>Repository Link:</h1>
                  <ul>
                    <li>
                      <a className='text-blue-600 hover:text-blue-800'>
                        {submission.repository_link ? submission.repository_link : 'N/A'}
                      </a>
                    </li>
                  </ul>
                </div>

                <div className=' rounded-lg shadow-md p-4 mr-4 mb-4'>
                  <h1 className='text-xl font-bold mb-4'>Report Link:</h1>
                  <ul>
                    <li>
                      <a className='text-blue-600 hover:text-blue-800'>
                        {submission.report_link ? submission.report_link : 'N/A'}
                      </a>
                    </li>
                  </ul>
                </div>

                <div className=' rounded-lg shadow-md p-4 mr-4 mb-4'>
                  <h1 className='text-xl font-bold mb-4'>Presentation Link:</h1>
                  <ul>
                    <li>
                      <a className='text-blue-600 hover:text-blue-800'>
                        {submission.presentation_link ? submission.presentation_link : 'N/A'}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                {submission.presentation_link === '' ? (
                  <>
                    {showButton ? (
                      <ReactiveButton
                        onClick={handleClick}
                        color='green'
                        idleText='upload links'
                        loadingText='Loading'
                        successText='Done'
                        rounded={true}
                        type='submit'
                        shadow
                      />
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>

            {/* upload Links  */}
            <br></br>

            {showUploadLink ? (
              <></>
            ) : (
              <div className=' rounded-lg shadow-md p-4 pl-10 pr-10'>
                <h1 className='text-xl font-bold mb-4'>Upload Links:</h1>
                <div className='mb-4'>
                  <label className='block  font-bold mb-2' htmlFor='repository-link'>
                    Repository Link:
                  </label>

                  <Input
                    className='appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline'
                    id='presentation-link'
                    type='text'
                    placeholder={submission.repository_link}
                    onChange={e => setUploadRepositorylink(e.target.value)}
                    required
                  />
                </div>
                <div className='mb-4'>
                  <label className='block  font-bold mb-2' htmlFor='presentation-link'>
                    Presentation Link:
                  </label>
                  <Input
                    className='appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline'
                    id='presentation-link'
                    type='text'
                    placeholder={submission.presentation_link}
                    onChange={e => setUploadPresentationlink(e.target.value)}
                    required
                  />
                </div>
                <div className='mb-4'>
                  <label className='block  font-bold mb-2' htmlFor='report-link'>
                    Report Link:
                  </label>
                  <Input
                    className='appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline'
                    id='report-link'
                    type='text'
                    placeholder={submission.report_link}
                    onChange={e => setUploadReportlink(e.target.value)}
                    required
                  />
                </div>
                <div className='text-right flex'>
                  <div className='p-2'>
                    <ReactiveButton
                      onClick={uploadLinks}
                      color='violet'
                      idleText='Submit'
                      loadingText='Loading'
                      successText='Done'
                      rounded={true}
                      shadow
                    />
                  </div>

                  <div className='p-2'>
                    <ReactiveButton
                      onClick={handleClose}
                      color='violet'
                      idleText='Close'
                      loadingText='Loading'
                      successText='Done'
                      rounded={true}
                      shadow
                    />
                  </div>
                </div>
              </div>
            )}

            <br></br>

            {/* Update Links  */}
            {submission.presentation_link !== '' ? (
              <>
                <div className=' rounded-lg shadow-md p-4 pl-10 pr-10'>
                  <h1 className='text-xl font-bold mb-4'>Update Links:</h1>
                  <div className='mb-4'>
                    <label className='block  font-bold mb-2' htmlFor='repository-link'>
                      Repository Link:
                    </label>
                    <Input
                      className='appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline'
                      id='repository-link'
                      type='text'
                      placeholder={submission.repository_link}
                      onChange={e => setUpdateRepositorylink(e.target.value)}
                      required
                    />
                  </div>
                  <div className='mb-4'>
                    <label className='block  font-bold mb-2' htmlFor='presentation-link'>
                      Presentation Link:
                    </label>
                    <Input
                      className='appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline'
                      id='presentation-link'
                      type='text'
                      placeholder={submission.presentation_link}
                      onChange={e => setUpdatePresentationlink(e.target.value)}
                      required
                    />
                  </div>
                  <div className='mb-4'>
                    <label className='block  font-bold mb-2' htmlFor='report-link'>
                      Report Link:
                    </label>
                    <Input
                      className='appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline'
                      id='report-link'
                      type='text'
                      placeholder={submission.report_link}
                      onChange={e => setUpdateReportlink(e.target.value)}
                      required
                    />
                  </div>
                  <div className='text-right'>
                    <ReactiveButton
                      onClick={updateLinks}
                      color='violet'
                      idleText='Submit'
                      loadingText='Loading'
                      successText='Done'
                      rounded={true}
                      shadow
                    />
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
          </Card>
        </>
      )}
    </>
  )
}

export default index
