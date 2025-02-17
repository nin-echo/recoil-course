import { atomFamily, useRecoilState } from 'recoil'
import { selectedElemetState } from '../../Canvas'
import { Drag } from '../Drag'
import { Resize } from '../Resize'
import { RectangleContainer } from './RectangleContainer'
import { RectangleInner } from './RectangleInner'

export type ElementStyle = {
    position: { top: number; left: number }
    size: { width: number; height: number }
}

export type Element = { style: ElementStyle }

export const elementState = atomFamily<Element, number>({
    key: 'element',
    default: { style: { position: { top: 0, left: 0 }, size: { width: 200, height: 200 } } },
})

export const Rectangle = ({ id }: { id: number }) => {
    const [selectedElement, setSelectedElement] = useRecoilState(selectedElemetState)
    const [element, setElement] = useRecoilState(elementState(id))

    const selected = selectedElement === id

    return (
        <Drag
            position={element.style.position}
            onDrag={(position) => {
                setElement({
                    style: {
                        ...element.style,
                        position,
                    },
                })
            }}
        >
            <div>
                <RectangleContainer
                    position={element.style.position}
                    size={element.style.size}
                    onSelect={() => {
                        setSelectedElement(id)
                    }}
                >
                    <Resize selected={selected}
                        position={element.style.position}
                        size={element.style.size}
                        onResize={(style) => setElement({ style })}
                    >

                        <Drag
                            position={element.style.position}
                            onDrag={(position) => {
                                setElement({
                                    style: {
                                        ...element.style,
                                    }
                                })
                            }}
                        >

                            <RectangleInner selected={id === selectedElement} />
                        </Drag>
                    </Resize>
                </RectangleContainer>
            </div>
        </Drag>
    )
}