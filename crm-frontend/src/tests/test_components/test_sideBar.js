import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';

function TestSideBar() {
    return(
        <div>
            <ProSidebar>
                <Menu iconShape="square">
                    <MenuItem >DashBoard</MenuItem>
                    <SubMenu title="Components">
                        <MenuItem>Component 1</MenuItem>
                        <MenuItem>Component 2</MenuItem>
                    </SubMenu>
                </Menu>
            </ProSidebar>
        </div>
        )
}

export default TestSideBar