# Nebula Graph Studio
Nebula Graph Studio (Studio for short) is a web-based visualization tool for Nebula Graph. With Studio, you can create a graph schema, import data, edit nGQL statements for data queries, and explore graphs.
![](./introduction.png)

## Architecture
![](architecture.png)

## Development Quick Start
```shell
# 配置go环境(go root path, 代理)
# idea安装go插件后,在 Languages & Frameworks -> Go -> Go Modules 中, 
# 开启 Go modules integration, Environment: GOPROXY=https://goproxy.cn,direct
# server目录下找到 main.go 运行

#项目根目录下,启动前端项目
npm run dev

#登录页面(前端启动时会打印登录页面地址)
http://localhost:7001

```

### Set up nebula-graph-studio
```
#方式一:
$ npm install

#方式二:
#指定镜像安装
$ npm install -g cnpm -registry=https://registry.npm.taobao.org
$ npm run dev

# 如果有些依赖下载失败, 需要清理缓存重新下载
(Cannot read properties of null (reading ‘pickAlgorithm‘) 或者 webpack: command not found)
$ npm cache clear --force
$ npm i

# 如果一直编译失败: 先不限制下载内容版本,下载完成大部分包后,再使用旧的package-lock.json去限制版本,清理缓存,下载依赖
1.先备份 package-lock.json -> package-lock.json.bak; 
2.删除 package-lock.json
3.执行 npm i
4.使用 package-lock.json.bak 替换 package-lock.json
5.执行 npm cache clear --force
6.执行 npm i
```
### Set up go-server
```
// debug
// 注释掉example-config.yaml中的 port: 7001
// 注意: go依赖使用国内代理 https://goproxy.cn 或者 https://goproxy.io 避免依赖下载过慢
// go env -w GOPROXY=https://goproxy.cn,direct
从server下面的 main 方法启动


// build
$ cd server
$ go build -o server
$ nohup ./server &
```

## Production Deploy

### 1. Build Web Front
```
# 如已经安装过 node_modules 可以忽略npm run install这步
$ npm run install
# 注意, 前端重新编译(build)后, 也需要重新打包后端, 因为前端文件是直接打包到后端代码中一起部署的
$ npm run build
# 把编译好的前端文件放至后端指定的打包目录
mv dist server/assets
```

### 1. Build Web Backend
```
// 查看默认端口,如果打开就是7001, 否则是9000;
// default port 7001 in config/example-config.yaml 
# 查看gcc版本
$ gcc -v
# 如未安装gcc
$ yum -y install gcc gcc-c++

$ cd server
$ go build -o server
```

### 3. Start
```
$ nohup ./server &

// 启动后默认端口为 9000 (具体看example-config.yaml)
http://192.168.1.102:9000
```

### 4. Stop Server
Use when you want shutdown the web app
```
kill -9 $(lsof -t -i :9000)
```

### 5. rpm 打包, 使用scripts/pack_CentOS.sh
```shell
# 1.将 pack_CentOS.sh 拷贝至 nebula-studio-gin 源代码上一层目录
# 2.注意将example-config.yaml中的port配置的注释打开
# 3.执行 pack_CentOS.sh (依赖 gcc cmake, 参考README.md)
# 4.rpm包在 package/tmp 里

# 安装rpm工具
yum -y install rpmbuild rpmdevtools

# 安装cmake, 至少需要3.15版本(CMakeLists.txt)
yum -y install wget
wget https://down.24kplus.com/linux/cmake-3.15.3.tar.gz
tar -zxf cmake-3.15.3.tar.gz
cd cmake-3.15.3
./bootstrap --prefix=/usr --datadir=share/cmake --docdir=doc/cmake && make
make install
cmake --version

# 使用 打包

# 安装rpm包(安装依赖lsof)
yum -y install lsof
sudo rpm -i nebula-graph-studio-3.2.3.x86_64.rpm

# 启动应用
cd /usr/local/nebula-graph-studio/scripts/
sudo chmod +x *.sh
sudo bash start.sh

lsof -i:7001

#卸载 rpm 包
sudo rpm -e nebula-graph-studio-3.2.3.x86_64

#修改配置重启
cd /usr/local/nebula-graph-studio/config
vi example-config.yaml
#重启
systemctl restart nebula-graph-studio.service


```

## Documentation
[中文](https://docs.nebula-graph.com.cn/2.5.0/nebula-studio/about-studio/st-ug-what-is-graph-studio/)
[ENGLISH](https://https://docs.nebula-graph.io/2.5.0/nebula-studio/about-studio/st-ug-what-is-graph-studio/)

## Contributing
Contributions are warmly welcomed and greatly appreciated. Please see [Guide Docs](https://github.com/vesoft-inc-private/nebula-graph-studio/blob/master/CONTRIBUTING.md) 