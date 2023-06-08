import React from 'react'
import { Divider, Box, Image, Text, Heading, VStack, HStack, Center, Skeleton, FormControl, Spinner, InputGroup, Input, InputLeftAddon, Button, TextArea, Link, Stack, Flex, Spacer, Avatar, Select } from 'native-base'
import { monthMapper, getAvatarInitials } from '../../utils'

const ProfileHero = ({ name, isUser, username, isInfluencer, userBio, highestLevel, dateCreated, profilePictureURL, setInEditMode }) => {
    return (

        <VStack space={3} pb={0} >

            {/* <Image source={{
                uri: "https://wallpaperaccess.com/full/317501.jpg"
            }} alt="Alternate Text" size="xl" w="100%" h="30%" /> */}

            <Flex direction="row"  >
                < Avatar bg="indigo.500" source={profilePictureURL ? { uri: profilePictureURL } : null}>{getAvatarInitials(name)}</Avatar>

                <Spacer />
                {
                    isUser &&
                    <Button size="md" variant="link" onPress={() => setInEditMode(true)} colorScheme="indigo" >Edit Profile</Button>
                }
                {/* {
                    !isUser &&
                    <Button size="sm" variant="link" onPress={() => setInEditMode(true)} colorScheme="indigo" >Add Friend +</Button>
                } */}
            </Flex>

            <Flex direction="row">
                <VStack space={1}>
                    {/* <Text italic fontSize="md" color="gray.400" >Diamond League</Text> */}
                    <VStack>
                        <Heading size="xl">{name} {isInfluencer && "🏀"} </Heading>
                        <Text color="gray.400" fontSize="lg" >@{username}</Text>
                    </VStack>
                </VStack>
                <Spacer />
            </Flex>

            <Flex direction="row" >
                <Text color="gray.600" >{userBio}</Text>
            </Flex>

            <HStack space={8} >
                <Text color="gray.400" italic fontSize="xs">Played {highestLevel}</Text>
                <Text color="gray.400" italic fontSize="xs">Joined {monthMapper[dateCreated.slice(5, 7)]} {dateCreated.slice(0, 4)}</Text>
            </HStack>
        </VStack>

    )
}

export default ProfileHero
