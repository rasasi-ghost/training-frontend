import React, { useState } from 'react';
import { Menu } from '@headlessui/react';
import { Link, useNavigate } from 'react-router-dom';
import Lucide from "@/components/Base/Lucide";
import { UserController } from '@/controllers';
import UserStore from '@/state/UserStore';
import { observer } from 'mobx-react-lite';

const UserMenu: React.FC = observer(() => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, isAdmin, isTeacher, isStudent } = UserStore;
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await UserController.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!currentUser) return null;

  return (
    <Menu as="div" className="relative">
      <Menu.Button 
        className="flex items-center px-3 py-2 text-sm rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-8 h-8 image-fit">
          <img 
            alt={currentUser.displayName} 
            className="rounded-full border-2 border-white shadow-lg" 
            src="https://via.placeholder.com/200" 
          />
        </div>
        <div className="ml-2 text-left">
          <div className="font-medium">{currentUser.displayName}</div>
          <div className="text-xs text-slate-500">{currentUser.role}</div>
        </div>
        <Lucide icon="ChevronDown" className="w-4 h-4 ml-2" />
      </Menu.Button>

      <Menu.Items className={`absolute right-0 mt-1 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-1 py-1">
          <Menu.Item>
            {({ active }) => (
              <Link
                to="/profile-overview"
                className={`${
                  active ? 'bg-primary text-white' : 'text-gray-900'
                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
              >
                <Lucide icon="User" className="w-4 h-4 mr-2" />
                My Profile
              </Link>
            )}
          </Menu.Item>
          
          {isAdmin && (
            <Menu.Item>
              {({ active }) => (
                <Link
                  to="/users"
                  className={`${
                    active ? 'bg-primary text-white' : 'text-gray-900'
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  <Lucide icon="Users" className="w-4 h-4 mr-2" />
                  Manage Users
                </Link>
              )}
            </Menu.Item>
          )}
          
          <Menu.Item>
            {({ active }) => (
              <Link
                to="/settings"
                className={`${
                  active ? 'bg-primary text-white' : 'text-gray-900'
                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
              >
                <Lucide icon="Settings" className="w-4 h-4 mr-2" />
                Settings
              </Link>
            )}
          </Menu.Item>
        </div>
        
        <div className="px-1 py-1">
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={handleLogout}
                className={`${
                  active ? 'bg-danger text-white' : 'text-danger'
                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
              >
                <Lucide icon="LogOut" className="w-4 h-4 mr-2" />
                Logout
              </button>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  );
});

export default UserMenu;
