import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { GroupMenu, SideMenu, useSideMenuCascade } from '@hi-ui/menu'
import { AppStoreFilled, MenuOutlined, EllipsisOutlined, PlusOutlined } from '@hi-ui/icons'
import Button from '@hi-ui/button'
import IconButton from '@hi-ui/icon-button'
import Layout, {
  Sider,
  Content,
  SearchTrigger,
  FloatMenuContainer,
  AppListPopover,
  ProfilePopover,
} from '@hi-ui/layout'
import PageHeader from '@hi-ui/page-header'
import EllipsisTooltip from '@hi-ui/ellipsis-tooltip'
import Space from '@hi-ui/space'
import Dropdown from '@hi-ui/dropdown'
import Avatar from '@hi-ui/avatar'
import type { MenuRouteObject } from '../types/routes'
import { convertRoutesToMenuData, findRouteTitle, findPathById, findRouteExtra } from '../utils/menu-route'

interface AppLayoutProps {
  routes: MenuRouteObject[]
  children: React.ReactNode
}

export const AppLayout: React.FC<AppLayoutProps> = ({ routes, children }) => {
  const location = useLocation()
  const navigate = useNavigate()

  // 获取当前路由的标题
  const currentPath = location.pathname === '/' ? '/' : location.pathname.slice(1)
  const pageTitle = findRouteTitle(routes, currentPath) || '页面标题'
  const pageExtra = findRouteExtra(routes, currentPath)

  // 将路由转换为菜单数据
  const menuData = React.useMemo(() => convertRoutesToMenuData(routes), [routes])

  // 侧边栏导航是否折叠
  const [collapsed, setCollapsed] = React.useState(true)

  // 鼠标悬浮到侧边栏菜单项的 id
  const [selectMenuId, setSelectMenuId] = React.useState<React.ReactText>('')
  // 当前激活的菜单项的 id
  const [activeMenuId, setActiveMenuId] = React.useState<React.ReactText>(currentPath || '/')
  // 定时器，用于优化浮动菜单的隐藏时体验
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const timerRef2 = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const sideMenuRef = React.useRef<HTMLDivElement>(null)
  const floatContainerRef = React.useRef<HTMLDivElement>(null)
  const siderRef = React.useRef<HTMLDivElement>(null)

  const { submenuData, activeParentId } = useSideMenuCascade({
    data: menuData,
    selectId: selectMenuId,
    activeId: activeMenuId,
  })

  // 浮动菜单是否显示
  const [floatContainerVisible, setFloatContainerVisible] = React.useState(submenuData.length > 0)
  // 浮动菜单是否折叠
  const [floatContainerCollapsed, setFloatContainerCollapsed] = React.useState(submenuData.length === 0)

  // 应用列表是否显示
  const [appListPopoverVisible, setAppListPopoverVisible] = React.useState(false)
  // 激活的应用 id
  const [activeAppId, setActiveAppId] = React.useState<React.ReactText>('')

  const [profileVisible, setProfileVisible] = React.useState(false)
  const [settingsValue, setSettingsValue] = React.useState({})

  // 同步当前路径到激活菜单
  React.useEffect(() => {
    const path = location.pathname === '/' ? '/' : location.pathname.slice(1)
    setActiveMenuId(path)
  }, [location.pathname])

  // 处理菜单点击导航
  const handleMenuClick = (id: string | number) => {
    const path = findPathById(routes, id)
    if (path) {
      navigate(path)
    }
  }

  return (
    <Layout style={{ height: '100vh', backgroundColor: '#f5f8fc' }}>
      <Sider ref={siderRef} style={{ backgroundColor: '#edf2ff' }} collapsed={collapsed} onCollapse={setCollapsed}>
        <div
          style={{
            padding: '16px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ borderRadius: 6 }}>
              <img
                src='https://cdn.cnbj1.fds.api.mi-img.com/mi.com-assets/shop/img/logo-mi2.png'
                style={{ width: 28, height: 28 }}
                alt='logo'
              />
            </div>
            {collapsed ? null : <div style={{ fontWeight: 500, color: '#1a1d26' }}>系统名称</div>}
          </div>
          <AppListPopover
            visible={appListPopoverVisible}
            activeId={activeAppId}
            data={[
              {
                icon: <AppStoreFilled />,
                iconBgColor: 'BLUE',
                id: 1,
                title: '应用1',
              },
              {
                icon: 'Y',
                iconBgColor: 'SKYBLUE',
                id: 2,
                title: '应用2',
              },
            ]}
            titleRender={(item) => {
              return <EllipsisTooltip>{item.title as string}</EllipsisTooltip>
            }}
            onItemClick={(item) => {
              setActiveAppId(item.id)
              setAppListPopoverVisible(false)
            }}
            onOutsideClick={() => setAppListPopoverVisible(false)}
          >
            <IconButton
              style={!collapsed ? { marginInlineStart: 'auto' } : { margin: '16px auto 0' }}
              icon={<MenuOutlined size={18} />}
              effectColor='rgba(124, 135, 166, 0.15)'
              effect
              onClick={() => {
                setAppListPopoverVisible(!appListPopoverVisible)
              }}
            />
          </AppListPopover>
        </div>
        <SearchTrigger
          mini={collapsed}
          data={menuData}
          onClick={(_evt) => {
            // 阻止默认行为，设置后不会触发默认的搜索行为
            // evt.preventDefault()
          }}
        />
        <SideMenu
          ref={sideMenuRef}
          mini={collapsed}
          selectedId={selectMenuId}
          activeId={activeParentId}
          onClick={(_event, id, item) => {
            if (!item.children || item.children.length === 0) {
              setActiveMenuId(id)
              setFloatContainerVisible(false)
              setFloatContainerCollapsed(true)
              setSelectMenuId(id)
              handleMenuClick(id)
            } else {
              const submenuFirstItem = submenuData[0]?.children?.[0]
              if (submenuFirstItem) {
                setActiveMenuId(submenuFirstItem.id)
                setFloatContainerVisible(true)
                setFloatContainerCollapsed(false)
                handleMenuClick(submenuFirstItem.id)
              }
            }
          }}
          onMouseEnter={(_event, id, item) => {
            timerRef2.current = setTimeout(() => {
              // hover 到一级菜单时，如果有二级菜单，则显示浮动菜单，并且更新选中的菜单项
              if (item.children && item.children.length > 0) {
                setSelectMenuId(id)
                setFloatContainerVisible(true)
              }
              // 如果没有二级菜单，并且激活的一级菜单有二级菜单，则将选中的菜单项设置为激活的一级菜单
              else if ((menuData.find((item) => item.id === activeParentId)?.children?.length || 0) > 0) {
                setSelectMenuId(activeParentId)
                if (floatContainerCollapsed) {
                  setFloatContainerVisible(false)
                }
              }
            }, 200)

            if (timerRef.current) {
              clearTimeout(timerRef.current)
            }
          }}
          onMouseLeave={(event, id, _item) => {
            if (timerRef2.current) {
              clearTimeout(timerRef2.current)
            }
            // 当鼠标离开菜单时，将当前选中的菜单项设置为父级菜单项
            if (
              !sideMenuRef.current?.contains(event.relatedTarget as Node) &&
              !floatContainerRef.current?.contains(event.relatedTarget as Node) &&
              !siderRef.current?.contains(event.relatedTarget as Node)
            ) {
              // 如果选中的菜单项不是激活的一级菜单，并且激活的一级菜单有二级菜单，或者浮动菜单折叠，则将选中的菜单项设置为激活的一级菜单
              if (
                (id !== activeParentId &&
                  (menuData.find((item) => item.id === activeParentId)?.children?.length || 0) > 0) ||
                floatContainerCollapsed
              ) {
                setSelectMenuId(activeParentId)
              }
            }

            timerRef.current = setTimeout(() => {
              setFloatContainerVisible(false)
            }, 200)
          }}
          data={menuData}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            margin: '12px 8px',
            marginBlockStart: 'auto',
          }}
        >
          <ProfilePopover
            visible={profileVisible}
            header={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Avatar size='lg' />
                用户名
              </div>
            }
            footer={<div onClick={() => setProfileVisible(false)}>退出登录</div>}
            settings={{
              value: settingsValue,
              data: [
                {
                  id: 'timezone',
                  title: '时区',
                  subtitle: 'UTC+08:00',
                  children: [{ id: 'timezone-1', title: '时区1' }],
                },
                {
                  id: 'language',
                  title: '语言',
                  subtitle: '中文',
                  children: [{ id: 'language-1', title: '语言1' }],
                },
              ],
              onItemClick: (_evt, _item) => {
                // evt.preventDefault()
              },
              onChange: (value) => {
                setSettingsValue(value)
                setProfileVisible(false)
              },
            }}
            onClose={() => setProfileVisible(false)}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                height: 40,
                marginLeft: collapsed ? 12 : 10,
                fontSize: 14,
                cursor: 'pointer',
              }}
              onClick={() => setProfileVisible(!profileVisible)}
            >
              <Avatar size='xs' />
              {collapsed ? null : <span>用户名</span>}
            </div>
          </ProfilePopover>
        </div>
      </Sider>
      <FloatMenuContainer
        ref={floatContainerRef}
        width={180}
        visible={floatContainerVisible}
        collapsed={floatContainerCollapsed}
        onCollapse={(collapsed) => {
          setFloatContainerCollapsed(collapsed)
          if (collapsed) {
            setFloatContainerVisible(false)
          } else {
            setFloatContainerVisible(true)
          }
        }}
        onMouseEnter={() => {
          setFloatContainerVisible(true)

          if (timerRef.current) {
            clearTimeout(timerRef.current)
          }
        }}
        onMouseLeave={(event) => {
          timerRef.current = setTimeout(() => {
            setFloatContainerVisible(false)
          }, 200)

          // 当鼠标离开菜单时，将当前选中的菜单项设置为父级菜单项
          if (
            !sideMenuRef.current?.contains(event.relatedTarget as Node) &&
            !floatContainerRef.current?.contains(event.relatedTarget as Node) &&
            !siderRef.current?.contains(event.relatedTarget as Node)
          ) {
            // 如果激活的一级菜单有二级菜单，或者浮动菜单折叠，则将选中的菜单项设置为激活的一级菜单
            if (
              (menuData.find((item) => item.id === activeParentId)?.children?.length || 0) > 0 ||
              floatContainerCollapsed
            ) {
              setSelectMenuId(activeParentId)
            }
          }
        }}
      >
        <GroupMenu
          activeId={activeMenuId}
          data={submenuData}
          onClick={(_evt, id, _item) => {
            setActiveMenuId(id)
            handleMenuClick(id)
          }}
        />
      </FloatMenuContainer>
      <Content>
        <PageHeader
          title={pageTitle}
          backIcon={false}
          extra={
            <Space>
              <Dropdown
                data={[
                  { id: 'add', title: '添加' },
                  { id: 'edit', title: '编辑' },
                  { id: 'delete', title: '删除' },
                ]}
                width={80}
              >
                <Button appearance='line' icon={<EllipsisOutlined />} />
              </Dropdown>
              <Button 
                type='primary' 
                appearance='line'
                onClick={() => {
                  const exportData = (window as any).__invoiceExportData
                  if (exportData) {
                    exportData()
                  } else {
                    alert('当前页面不支持批量导出')
                  }
                }}
              >
                批量导出
              </Button>
              {pageExtra ?? (
                <Button type='primary' icon={<PlusOutlined />}>
                  主操作
                </Button>
              )}
            </Space>
          }
        />
        <div
          style={{
            flex: 1,
            marginBottom: 16,
            borderRadius: 12,
            backgroundColor: '#fff',
            boxShadow: '0 0 4px rgba(92, 94, 102, 0.06)',
            padding: 12,
            overflow: 'auto',
          }}
        >
          {children}
        </div>
      </Content>
    </Layout>
  )
}
