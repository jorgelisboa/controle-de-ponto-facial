'use client'

import { Layout, Menu, MenuProps } from "antd";

import { LineChartOutlined, UserOutlined } from '@ant-design/icons';
import { MenuNavigateEnum } from "@enums/MenuNavigateEnum";
import { useRouter } from "next/navigation";

const { Header } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

export default function Navbar() {
  const router = useRouter();

  const items: MenuItem[] = [
    {
      label: 'Dashboard',
      key: 'DASHBOARD',
      icon: <LineChartOutlined />,
    },
    {
      label: 'Users',
      key: 'USERS',
      icon: <UserOutlined />,
    },
  ]

  const onMenuClick: MenuProps['onClick'] = (e) => {
    const route = MenuNavigateEnum[e.key as keyof typeof MenuNavigateEnum];
    if (route) {
      router.push(route);
    } else {
      console.warn(`No route defined for key ${e.key}`);
    }
  };

  return (
    <Header style={{ display: 'flex', alignItems: 'center' }}>
      <div className="demo-logo" />
      <Menu
        theme="light"
        mode="horizontal"
        defaultSelectedKeys={['2']}
        items={items}
        style={{ flex: 1, minWidth: 0 }}
        onClick={onMenuClick}
      />
    </Header>
  );
}
