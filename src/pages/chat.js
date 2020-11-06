import React, { useState, useRef } from 'react'
import styled from 'styled-components'

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

const fireBaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  appId: process.env.APP_ID
}

const {apiKey, appId} = fireBaseConfig



firebase.initializeApp({
  apiKey: apiKey,
  authDomain: "chat-7d1fe.firebaseapp.com",
  databaseURL: "https://chat-7d1fe.firebaseio.com",
  projectId: "chat-7d1fe",
  storageBucket: "chat-7d1fe.appspot.com",
  messagingSenderId: "614752894781",
  appId: appId
})


const Main = styled.div`
  text-align: center;
  max-width: 728px;
  margin: 0 auto;
`

const Header = styled.h4`
  background-color: #181717;
  height: 10vh;
  min-height: 50px;
  color: white;
  position: fixed;
  width: 100%;
  max-width: 728px;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 99;
  padding: 10px;
  box-sizing: border-box;
`

const Section = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
  background-color: rgb(40, 37, 53);
`

const Messages = styled.div`
  padding: 10px;
  height: 80vh;
  margin: 10vh 0 10vh;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  ::-webkit-scrollbar {
    width: 0.25rem;
  }
  ::-webkit-scrollbar-track {
    background: #1e1e24;
  }
  ::-webkit-scrollbar-thumb {
    background: #6649b8;
  }
`
const Text = styled.p`
  max-width: 500px;
  margin-bottom: 12px;
  line-height: 24px;
  padding: 10px 20px;
  border-radius: 25px;
  position: relative;
  color: white;
  text-align: center;
  color: ${({value})=> value === 'received' ? `black` : `white`};
  background: ${({value})=> value === 'received' ? `#e5e5ea` : `#0b93f6`};
  

`
const Image = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 2px 5px;
`

const Form = styled.form`
  height: 10vh;
  position: fixed;
  bottom: 0;
  background-color: rgb(24, 23, 23);
  width: 100%;
  max-width: 728px;
  display: flex;
  font-size: 1.5rem;
`

const FormButton = styled.button`
  width: 20%;
  background-color: rgb(56, 56, 143);
`

const Input = styled.input`
  line-height: 1.5;
  width: 100%;
  font-size: 1.5rem;
  background: rgb(58, 58, 58);
  color: white;
  outline: none;
  border: none;
  padding: 0 10px;
`

const Button = styled.button`
  background-color: #282c34; /* Green */
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  cursor: pointer;
  font-size: 1.25rem;
`


const Span = styled.span`
display: flex;
align-items: center;
flex-direction: ${({value})=> value === 'sent' ? `row-reverse` : `row`};
`

function Chat() {
  
  const auth = firebase.auth()
  const firestore = firebase.firestore()

  const [user] = useAuthState(auth)

  const SignIn = () => {
    const signInWithGoogle = () => {
      const provider = new firebase.auth.GoogleAuthProvider()
      auth.signInWithPopup(provider)
    }
    return (
      <Button  onClick={signInWithGoogle}>
        Sign in with Google
      </Button>
    )
  }

  const SignOut = () => {
    const signOutWithGoogle = () => {
      auth.signOut()
    }
    return (
      auth.currentUser && <Button onClick={signOutWithGoogle}>Sign Out</Button>
    )
  }

  const ChatRoom = () => {
    const messagesRef = firestore.collection('messages')
    const query = messagesRef.orderBy('createdAt').limit(25)
    const [messages] = useCollectionData(query, { idField: 'id' })
    const [formValue, setFormValue] = useState('')
    const fake = useRef()
    const sendMessage = async (e) => {
      e.preventDefault()

      const { uid, photoURL } = auth.currentUser

      await messagesRef.add({
        text: formValue,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        photoURL,
      })
      setFormValue('')

      fake.current.scrollIntoView({ behavior: 'smooth' })
    }

    return (
      <>
        <Messages>
          {messages &&
            messages.map((msg, i) => <ChatMessage message={msg} key={i} />)}
          <span ref={fake}></span>
        </Messages>

        <Form onSubmit={sendMessage}>
          <Input
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            placeholder="say something nice"
          />

          <FormButton type="submit">🚀</FormButton>
        </Form>
      </>
    )
  }

  const ChatMessage = (props) => {
    const { text, uid, photoURL } = props.message

    const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received'

    return (
  
   <Span value={`${messageClass}`}>
        <Image src={photoURL || `https://avatars.dicebear.com/api/male/john.svg?mood[]=happy`} alt="" />
        <Text value={`${messageClass}`} >{text}</Text>
  
      </Span>
    )
  }

  return (
    <>
      <Main>
        <Header>
          <h1>⚛️🔥💬</h1>
          <SignOut />
        </Header>
        <Section>{user ? <ChatRoom /> : <SignIn />}</Section>
      </Main>
    </>
  )
}

export default Chat

