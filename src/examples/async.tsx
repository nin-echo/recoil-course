import { Container, Heading, Text } from '@chakra-ui/layout'
import { Select } from '@chakra-ui/select'
import { Suspense, useState } from 'react'
import { atom, selector, selectorFamily, useRecoilState, useRecoilValue } from 'recoil'
import { getWeather } from './fakeAPI'

const userState = selectorFamily({
    key: 'user',
    get: (userId: number) => async () => {
        const userData = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
        return userData.json()
    },
})

const weatherState = selectorFamily({
    key: 'weather',
    get:
        (userId: number) =>
            async ({ get }) => {
                const user = get(userState(userId))

                const weather = await getWeather(user.address.city)
                return weather
            },
})

const UserWeather = ({ userId }: { userId: number }) => {
    const user = useRecoilValue(userState(userId))
    const weather = useRecoilValue(weatherState(userId))

    return (
        <Text>
            <b>Weather for {user.address.city}: </b> {weather}°C
        </Text>

    )
}

const UserData = ({ userId }: { userId: number }) => {
    const user = useRecoilValue(userState(userId))
    if (!user) return null

    return (
        <div>
            <Heading as="h2" size="md" mb={1}>
                User data:
            </Heading>
            <Text>
                <b>Name:</b> {user.name}
            </Text>
            <Text>
                <b>Phone:</b> {user.phone}
            </Text>
            <Suspense fallback={<Text>Loading...</Text>}>
                <UserWeather userId={userId} />
            </Suspense>
        </div>
    )
}

export const Async = () => {
    const [userId, setUserId] = useState<undefined | number>(undefined)

    return (
        <Container py={10}>
            <Heading as="h1" mb={4}>
                View Profile
            </Heading>
            <Heading as="h2" size="md" mb={1}>
                Choose a user:
            </Heading>
            <Select
                placeholder="Choose a user"
                mb={4}
                value={userId}
                onChange={(event) => {
                    const value = event.target.value
                    setUserId(value ? parseInt(value) : undefined)
                }}
            >
                <option value="1">User 1</option>
                <option value="2">User 2</option>
                <option value="3">User 3</option>
            </Select>
            {userId && (
                <Suspense fallback={<Text>Loading...</Text>}>
                    <UserData userId={userId} />
                </Suspense>
            )}
        </Container>
    )
}
