import { Audio } from  'react-loader-spinner'
import './Loading.css'

const Loading = ({ show }) => {
    return !show ? (<></>) : (
        <div className='loading'>
            <div className='overlay'></div>
            <Audio
                height = "25"
                width = "25"
                radius = "9"
                color = 'black'
                ariaLabel = 'three-dots-loading'     
                wrapperStyle
            />
        </div>
    )
}

export default Loading