# HBC WALLET

## 账户创建流程

    1、用户输入密码，SHA256后保存到客户端

    2、随机生成12助记词，根据AES + 密码进行加密

    3、根据12词生成私钥， 根据私钥生成address，客户端保存address

    4、根据password对私钥进行加密，生成keystore，保存到客户端

## 账户登录流程

### 密码登录

    1、输入的密码，解密keystore，正确解开，登录成功；

    2、密码不正确，登录失败

    3、忘记密码，走导入流程

## 账户导入

### 助记词导入

    1、根据输入助记词，输入新密码，生成秘钥，生成新keystore，保存客户端，导入成功

### 私钥导入

    1、输入私钥，密码，生成address，根据密码加密生成keystore保存客户端

### keystore 导入

    1、根据密码解密keystore文件，解密正确，得到私钥，address。客户端保存keystore。

## 客户端保存内容

    1、keystore
