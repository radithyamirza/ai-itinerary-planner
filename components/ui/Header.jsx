import { GiAstronautHelmet } from 'react-icons/gi';
import { UserButton } from '@clerk/clerk-react';

import Link from 'next/link';

const Header = (props) => {
  return (
    <div className='w-full bg-purple-600 py-4'>
      <div className='w-10/12 mx-auto  flex justify-between items-center'>
        <Link href={'/'}>
          <a>
            <h4 className='text-white text-2xl font-bold flex items-center'>
              <GiAstronautHelmet className='mr-4' />
              Clerk is Awesome
            </h4>
          </a>
        </Link>
        <div>
          <UserButton userProfileUrl='/profile' />
        </div>
      </div>
    </div>
  );
};

export default Header;
