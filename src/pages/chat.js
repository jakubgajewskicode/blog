import React, { useState, useRef } from 'react'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import './css/index.css'
import styled from 'styled-components'

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

const Main = styled.div`
  text-align: center;
  max-width: 728px;
  margin: 0 auto;
`
// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: 'AIzaSyDDWjnSjY9Wz7JLodY1vz8JPiFkqNZG0k8',
  authDomain: 'chat-7d1fe.firebaseapp.com',
  databaseURL: 'https://chat-7d1fe.firebaseio.com',
  projectId: 'chat-7d1fe',
  storageBucket: 'chat-7d1fe.appspot.com',
  messagingSenderId: '614752894781',
  appId: '1:614752894781:web:fd0603b850d7a59bc44f54',
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)

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
      <button className="sign-in" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
    )
  }

  const SignOut = () => {
    const signOutWithGoogle = () => {
      auth.signOut()
    }
    return (
      auth.currentUser && <button onClick={signOutWithGoogle}>Sign Out</button>
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
        <main>
          {messages &&
            messages.map((msg, i) => <ChatMessage message={msg} key={i} />)}
          <span ref={fake}></span>
        </main>

        <form onSubmit={sendMessage}>
          <input
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
          />

          <button type="submit">🚀</button>
        </form>
      </>
    )
  }

  const ChatMessage = (props) => {
    const { text, uid, photoURL } = props.message

    const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received'

    return (
      <div className={`message ${messageClass}`}>
        <img src={photoURL} alt="" />
        <p>{text}</p>
      </div>
    )
  }

  return (
    <>
      <Main>
        <header>
          <h1>⚛️🔥💬</h1>
          <SignOut />
        </header>
        <section>{user ? <ChatRoom /> : <SignIn />}</section>
      </Main>
    </>
  )
}

export default Chat
