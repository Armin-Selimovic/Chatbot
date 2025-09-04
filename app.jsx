function ChatInput({chatMessages, setChatMessages}) {
	const [isBusy, setisBusy] = React.useState(false);
	const [inputText, setInputText] = React.useState('');

	function SaveInputText(event) {
		setInputText(event.target.value);
	}

	async function SendMessage() {

		if(!inputText)
		{
			alert("Input a message")
			return;
		}

		if(isBusy)
			return;
		else
			setisBusy(true)

		setChatMessages([
			...chatMessages,
			{
				message: inputText,
				sender: 'user',
				id: crypto.randomUUID()
			}
		]);

		setInputText('');

		const tempId = crypto.randomUUID();

		setChatMessages(prev => [
			...prev,
			{
				message: 'Thinking...',
				sender: 'robot',
				id: tempId
			}
		]);

		const response = await Chatbot.getResponseAsync(inputText);

		setChatMessages(prev =>
			prev.map(m =>
				m.id === tempId
					? { ...m, message: response }
					: m
			)
		);

		setisBusy(false);
	}

		function handleKeyDown(e) {
			{e.key === 'Enter' && SendMessage()}
			{e.key === 'Escape' && setInputText('')}
		}

	return (
		<div className='topBar'>
			<input
				placeholder='Send a message to Chatbot'
				size='30'
				onChange={SaveInputText}
				value={inputText}
				onKeyDown={handleKeyDown}
				className='inputBar'
			/>

			<button onClick={SendMessage}>Send</button>
		</div>
	)
}

function Message(props) {
	const message = props.message;
	const sender = props.sender;

	return (
		<div className={sender === 'user' ? 'userMassage' : 'robotMessage'}>
			{sender === 'robot' && <img src="./images/robot.png" width='50'/>}
			<div className='message'>
				{message}
			</div>
			{sender === 'user' && <img src="./images/user.png" width='50'/>}
		</div>
	);
}

function ChatMessages({chatMessages}) {
	const ChatMessagesRef = React.useRef(null);

	React.useEffect(() => {
		const containterElem = ChatMessagesRef.current;
		if(containterElem){
			containterElem.scrollTop = containterElem.scrollHeight;
		}
	},[chatMessages]);
	return(
		<div className='chatMessagesContainer' ref={ChatMessagesRef}>
			{
				chatMessages.map((chatMessages) => {
					return (<Message message={chatMessages.message} sender={chatMessages.sender} key={chatMessages.id}/>);
				})
			}
		</div>
	)
}

function App() {
	/*const [chatMessages, setChatMessages] = React.useState([{
		message: 'hello chatbot',
		sender: 'user',
		id: 'id1'
	},
	{
		message: 'How can I help you',
		sender: 'robot',
		id: 'id2'
	}]); example of the messages array*/
	const [chatMessages, setChatMessages] = React.useState([]);

	return (
	<div className='appContainer'>
		<ChatMessages
			chatMessages={chatMessages}
		/>
		<ChatInput
			chatMessages={chatMessages}
			setChatMessages={setChatMessages}
		/>
	</div>
	);
}

const container = document.querySelector('.root');
ReactDOM.createRoot(container).render(<App />);