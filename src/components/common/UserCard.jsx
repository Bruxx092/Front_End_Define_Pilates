import {useNavigate} from 'react-router-dom';

const UserCard = ({ title, icon: Icon, description, to }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (to) {
            navigate(to);
        }
    };

    return (
        <div className = "w-64 flex flex-col items-center p-6 bg-white rounded-lg shadow-md cursor-pointer hover:shadow-xl transition-shadow duration-300"
             onClick={handleClick}
        >
            <div className='w-16 h-16 mb-4'>
                <Icon className="w-full h-full text-gray-700"/>
            </div>
            <h3 className='text-lg font-semibold text-center text-gray-800'>{title}</h3>
            <h4 className='text-sm font-mono text-center text-gray-500 mt-1'>{description}</h4>
        </div>
    );
};

export default UserCard;