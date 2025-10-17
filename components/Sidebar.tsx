
import React from 'react';
import type { NavItem } from '../types';
import { 
    UserIcon, RestoreIcon, FilterIcon, CameraIcon, SparklesIcon, UsersIcon, PaletteIcon,
    ScanFaceIcon, LinkIcon, SunIcon, BackgroundIcon, WandIcon, TrendingUpIcon, MessageCircleIcon, MoonIcon 
} from './Icons';

const mainNavItems: NavItem[] = [
    { icon: UserIcon, label: 'Chỉnh Sửa Ảnh Thẻ' },
    { icon: RestoreIcon, label: 'Phục Chế Ảnh Cũ', active: true },
    { icon: FilterIcon, label: 'Bộ Lọc Hình Ảnh' },
    { icon: CameraIcon, label: 'Ảnh Cưới AI' },
    { icon: SparklesIcon, label: 'Làm Nét Ảnh' },
    { icon: UsersIcon, label: 'Ghép Mặt Ảnh Gia Đình' },
    { icon: PaletteIcon, label: 'Màu Preset' },
    { icon: ScanFaceIcon, label: 'Cân Chỉnh Thẳng Mặt' },
    { icon: LinkIcon, label: 'Chỉnh Sửa Cân đối' },
    { icon: SunIcon, label: 'Ánh Sáng' },
    { icon: BackgroundIcon, label: 'Thay Nền' },
    { icon: WandIcon, label: 'Làm Sạch Nền' },
    { icon: TrendingUpIcon, label: 'Tạo ảnh Trend' },
];

const secondaryNavItems: NavItem[] = [
    { icon: MessageCircleIcon, label: 'Tham gia nhóm Zalo' },
];


const SidebarNavItem: React.FC<{ item: NavItem }> = ({ item }) => {
    const Icon = item.icon;
    const itemClasses = `flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
        item.active 
        ? 'bg-blue-600 text-white' 
        : 'text-gray-300 hover:bg-gray-700'
    }`;
    return (
        <li>
            <a href="#" className={itemClasses}>
                <Icon className="w-5 h-5 mr-3" />
                <span className="font-medium text-sm">{item.label}</span>
            </a>
        </li>
    );
};

export const Sidebar: React.FC = () => {
    return (
        <aside className="w-full lg:w-64 bg-[#292d33] p-4 flex flex-col flex-shrink-0">
            <div className="flex items-center mb-6">
                <button className="text-gray-400 hover:text-white mr-3">&lt;</button>
                <h1 className="text-lg font-bold text-white">NHC MAGIC TOOL</h1>
            </div>
            <nav className="flex-grow">
                <ul className="space-y-2">
                    {mainNavItems.map((item) => <SidebarNavItem key={item.label} item={item} />)}
                </ul>
            </nav>
            <div className="mt-auto">
                <ul className="space-y-2 pt-4 border-t border-gray-700">
                    {secondaryNavItems.map((item) => <SidebarNavItem key={item.label} item={item} />)}
                </ul>
                 <div className="flex items-center justify-between mt-4 p-3 rounded-lg bg-gray-700/50 cursor-pointer">
                    <div className="flex items-center">
                        <MoonIcon className="w-5 h-5 mr-3 text-gray-300" />
                        <span className="font-medium text-sm text-gray-300">Giao diện Sáng</span>
                    </div>
                    {/* Switch would go here */}
                </div>
            </div>
        </aside>
    );
};
