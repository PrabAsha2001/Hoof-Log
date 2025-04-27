const InputBox = ({ icon: Icon, ...props }) => {
	return (
		<div className=''>
			<div className=''>
				<Icon className='' />
			</div>
			<input
				{...props}
				className=''
			/>
		</div>
	);
};

export default InputBox;

