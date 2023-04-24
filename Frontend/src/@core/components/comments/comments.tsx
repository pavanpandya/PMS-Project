/* eslint-disable react-hooks/rules-of-hooks */
import { Box, Input } from '@mui/material'
import React, { useState, useEffect } from 'react'
import ReactiveButton from 'reactive-button'
import { styled } from '@mui/material/styles'
import {
  deleteComment,
  getAllComments,
  getProjectId,
  sendComment
} from 'src/@core/utils/ajax/student/studentComments/comments'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function comments() {
  const [comments, setComments] = useState([]) // replace [...] with your initial comments array
  const [showAll, setShowAll] = useState(false)
  const [projectId, setProjectId] = useState('')
  const [commentText, setCommentText] = useState('')
  const [showCommentBox, setCommentBox] = useState(false)
  const maxComments = 3

  let token: string | null
  if (typeof window !== 'undefined') {
    // Perform localStorage action
    token = localStorage.getItem('token')
  }
  const filteredComments = Array.isArray(comments)
    ? comments.filter((comment: { text?: string }) => comment.text !== '')
    : []

  const handleShowMore = () => {
    setShowAll(true)
  }
  const handleCloseCommentBox = () => {
    setCommentBox(false)
  }

  //get project id
  const getProjectid = async () => {
    try {
      const data = await getProjectId()
      console.log(data)
      setProjectId(data)
      if (data) {
      }
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    getProjectid()
  }, [])

  //get all comments
  const handleSubmit = async () => {
    try {
      setCommentBox(true)
      const data = await getAllComments({ projectId })
      console.log(data)
      setComments(data)
      if (data) {
      }
    } catch (error) {
      console.error(error)
    }
  }

  //delete comment
  const handleCommentDelete = async (commentId: any) => {
    try {
      setCommentBox(true)
      console.log(commentId)
      const data = await deleteComment({ commentId, projectId })
      console.log(data)
      handleSubmit()
      toast.success('Comment Deleted Successfully', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      })
    } catch (error) {
      handleSubmit()
      toast.error('Error While Deleteing Comment', {
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

  //send comment
  const handleComment = async () => {
    try {
      setCommentBox(true)
      const data = await sendComment({ projectId, commentText })
      console.log(data)
      toast.success('Comment added Successfully', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      })
      handleSubmit()
    } catch (error) {
      toast.error('Error While adding Comment', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      })
      handleSubmit()
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

  // handleCloseCommentBox
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
      <div>
        {showCommentBox ? (
          <div className='comment-section'>
            <br></br>
            {filteredComments.length === 0 ? (
              <Div>
                <Box sx={{ width: '100%' }}>
                  <div>No Comments yet</div>
                </Box>
              </Div>
            ) : (
              <div
                className=' rounded-lg shadow-xl p-4'
                style={{
                  height: '300px',
                  overflow: 'auto'
                }}
              >
                <Div>{'All Comments : '}</Div>
                {filteredComments.slice(0, showAll ? filteredComments.length : maxComments).map(comment => (
                  <div key={comment._id} className='my-4'>
                    <p className=' font-bold'>{comment.text}</p>
                    <div className='flex justify-between items-center mt-4'>
                      <p className='text-sm  text-red-500 italic '>{comment.name}</p>
                      <p className='text-sm text-gray-500'>{new Date(comment.date).toLocaleString()}</p>
                      {comment.email === localStorage.getItem('email') && (
                        <ReactiveButton
                          onClick={() => handleCommentDelete(comment._id)}
                          color='red'
                          idleText='Delete'
                          loadingText='Loading'
                          successText='Done'
                          rounded={true}
                          shadow
                          type='submit'
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <br></br>
            <div className='flex '>
              {!showAll && filteredComments.length > maxComments && (
                <div className='p-2'>
                  <ReactiveButton
                    onClick={handleShowMore}
                    color='violet'
                    idleText='Show More'
                    loadingText='Loading'
                    successText='Done'
                    rounded={true}
                    shadow
                    type='submit'
                  />
                </div>
              )}
              <br></br>
              <div className='p-2'>
                <ReactiveButton
                  onClick={handleCloseCommentBox}
                  color='violet'
                  idleText='Close'
                  loadingText='Loading'
                  successText='Done'
                  rounded={true}
                  shadow
                  type='submit'
                />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className='p-4'>
              <ReactiveButton
                onClick={handleSubmit}
                color='violet'
                idleText='Show Comments'
                loadingText='Loading'
                successText='Done'
                rounded={true}
                shadow
                type='submit'
              />
            </div>
          </>
        )}
      </div>
      <br></br>
      {/**Write a Comment  */}
      <div className=' rounded-lg shadow-2xl  '>
        <label htmlFor='message' className='block font-medium  mb-2 p-4'>
          Enter your message:
        </label>
        <div className='p-4'>
          <Input
            placeholder='Enter your Comments'
            id='message'
            name='message'
            className='border border-gray-300  rounded-md p-4 w-full h-32 mb-4'
            onChange={event => setCommentText(event.target.value)}
          ></Input>
        </div>

        <div className='p-4'>
          <>
            <ReactiveButton
              onClick={handleComment}
              color='violet'
              idleText='Submit'
              loadingText='Loading'
              successText='Done'
              rounded={true}
              shadow
              type='submit'
            />
          </>
        </div>
      </div>
    </>
  )
}

export default comments
