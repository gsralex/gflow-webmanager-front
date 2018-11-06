import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';

import logo from './logo.svg';
import 'antd/dist/antd.css';
import './App.css';
import { Link } from 'react-router-dom'

const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;
class App extends Component {

  state = {
    collapsed: false,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Header>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="1">  <Link to='/actionlist'>
              <Icon type="desktop" />Action</Link>
            </Menu.Item>
            <Menu.Item key="6">
              <Link to="/jobgrouplist">
                <Icon type="check-square" />Job</Link>
            </Menu.Item>
            <Menu.Item key="7">
              <Link to="/flowgrouplist">
                <Icon type="cluster" />Flow</Link>
              </Menu.Item>
            <Menu.Item key="8">
              <Link to='/timerlist'>
                <Icon type="clock-circle" />Timer</Link>
            </Menu.Item>
          </Menu>

        </Header>
        <Content>
          {/* <Breadcrumb style={{ margin: '18px 30px' }}>
            <Breadcrumb.Item><Link to="/actionlist">Home</Link></Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb> */}
          <Layout style={{ margin: '18px 16px', padding: '20px', background: '#fff', minHeight: 280 }}>
            <Layout style={{ background: '#fff' }}>
              {this.props.children}
            </Layout>
          </Layout>
        </Content>

      </Layout>

    );
  }
}

export default App;
