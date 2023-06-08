import React, { useState, useEffect } from 'react';
import { Button, Text, Heading, Box, Input, FormControl, Stack, VStack, Center } from 'native-base'
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'

import { app, db } from '../../firebase'
import { addDoc, collection, setDoc, doc } from 'firebase/firestore'
// import LoginOption from '../auth/LoginOption'
import LoginOption from '../../features/auth/LoginOption'
import HomeContent from '../../features/pickup/HomeContent'
// import HomeContent from '../../components/HomeContent'
import { navigateToProfile } from '../../utils'

export default HomeScreen = ({ navigation }) => {
    // navigation.navigate("Profile")
    const [initializing, setInitializing] = useState(true)
    const [user, setUser] = useState();
    const auth = getAuth()

    onAuthStateChanged(auth, user => {
        setUser(user)
        if (initializing) setInitializing(false)
    })

    // temp for dev
    // return (
    //     <Center>
    //         <HomeContent navigation={navigation} />
    //         {/* <Heading>this is homecourt</Heading> */}
    //     </Center>
    // )


    // to reveal home screen auth 
    if (initializing) return null

    if (!user) {


        // user not logged in
        return (
            <LoginOption setUser={setUser} navigation={navigation} />
        )
    }

    else {
        return (
            <Center>
                <HomeContent navigation={navigation} />
            </Center>
        )
    }


}

styles = {
    centerScreen: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },

    formField: {
        marginBottom: 50
    }
}
