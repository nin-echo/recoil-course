import { InputGroup, InputRightElement, NumberInput, NumberInputField, Text, VStack } from '@chakra-ui/react'
import produce from 'immer'
import _ from 'lodash'
import { selectorFamily, useRecoilState, useRecoilValue } from 'recoil'
import { selectedElemetState } from '../Canvas'
import { elementState } from './Rectangle/Rectangle'

const editPropertyState = selectorFamily<number, string>({
    key: 'editProperty',
    get: (path) => ({ get }) => {
        const selectedElement = useRecoilValue(selectedElemetState)
        if (selectedElement === null) return

        const element = get(elementState(selectedElement))

        return _.get(element, path)
    },
    set: (path) => ({ set, get }, newValue) => {
        const selectedElement = get(selectedElemetState)
        if (selectedElement === null) return

        const element = get(elementState(selectedElement))

        const newElement = produce(element, draft => {
            _.set(draft, path, newValue)
        })

        set(elementState(selectedElement), newElement)
    }
})

export const EditProperties = () => {

    const selectedElement = useRecoilValue(selectedElemetState)

    if (selectedElement === null) return null

    return (
        <Card>
            <Section heading="Position">
                <Property label="Top" path="style.position.top" id={selectedElement} />
                <Property label="Left" path="style.position.left" id={selectedElement} />
            </Section>
            <Section heading="Size">
                <Property label="Width" path="style.size.width" id={selectedElement} />
                <Property label="Height" path="style.size.height" id={selectedElement} />
            </Section>
        </Card>
    )
}

const Section: React.FC<{ heading: string }> = ({ heading, children }) => {
    return (
        <VStack spacing={2} align="flex-start">
            <Text fontWeight="500">{heading}</Text>
            {children}
        </VStack>
    )
}

const Property = ({ label, path, id }: { label: string; path: string; id: number }) => {
    const [value, setValue] = useRecoilState(editPropertyState(path))

    return (
        <div>
            <Text fontSize="14px" fontWeight="500" mb="2px">
                {label}
            </Text>
            <InputGroup size="sm" variant="filled">
                <NumberInput value={value} onChange={(_, value) => setValue(value)}>
                    <NumberInputField borderRadius="md" />
                    <InputRightElement pointerEvents="none" children="px" lineHeight="1" fontSize="12px" />
                </NumberInput>
            </InputGroup>
        </div>
    )
}

const Card: React.FC = ({ children }) => (
    <VStack
        position="absolute"
        top="20px"
        right="20px"
        backgroundColor="white"
        padding={2}
        boxShadow="md"
        borderRadius="md"
        spacing={3}
        align="flex-start"
        onClick={(e) => e.stopPropagation()}
    >
        {children}
    </VStack>
)