import { atom, useRecoilValue, useSetRecoilState } from 'recoil'
import { EditProperties } from './components/EditProperties'
import { Rectangle } from './components/Rectangle/Rectangle'
import { PageContainer } from './PageContainer'
import { Toolbar } from './Toolbar'

export const selectedElemetState = atom<number | null>({
    key: 'selectedElement',
    default: null,
})

export const elementsState = atom<number[]>({
    key: 'elements',
    default: [],
})


function Canvas() {
    const setSelectedElement = useSetRecoilState(selectedElemetState)
    const elements = useRecoilValue(elementsState)

    return (
        <PageContainer
            onClick={() => {
                setSelectedElement(null)
            }}
        >
            <Toolbar />
            <EditProperties />
            {elements.map((id) => (
                <Rectangle id={id} />
            ))}
        </PageContainer>
    )
}

export default Canvas