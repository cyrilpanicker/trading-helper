
import './Notes.css';

export default function Notes({ text, onChange, setShowLoading }) {
    const addNote = async (event) => {
        event.preventDefault();
        setShowLoading(true)
        try {
            await fetch('/add-note', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text })
            });
        } catch (error) {
            setShowLoading(false)
        }
        setShowLoading(false)
    }
    return (
        <form className="notes" onSubmit={addNote}>
            <textarea placeholder="notes..." value={text} onChange={onChange} ></textarea>
            <button>save</button>
        </form>
    )
}