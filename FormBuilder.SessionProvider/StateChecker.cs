using FormBuilder.Core;
using FormBuilder.DataAccess;
using FormBuilder.Utilities;
using NPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormBuilder.SessionProvider
{
    /// <summary>
    /// 校验用户状态
    /// </summary>
    public class StateChecker
    {
        public static ISessionKey CheckAuthString(string cookieStr)
        {
            // 获取当前用户ID 和token 检查状态

            ISessionKey user = null;
            buildSession(cookieStr, out user);

            CheckPCState(user);
            return user;
            // 检查完之后更新最后访问时间
            // 如果检查不同过则返回状态校验不通过
        }

        private static void CheckPCState(ISessionKey user)
        {
            Database db = DataBaseManger.GetDB("");
            var sql = new Sql("select count(1) from FBOnlineUser where UserToken=@0 and UID=@1 and DeviceType='PC'", user.Token, user.UserID);

            if (db.ExecuteScalar<long>(sql) <= 0)
            {
                throw new Exception("您的登录身份已过期，请重新登录,");
            }

        }

        private static void buildSession(string stateCookie, out ISessionKey user)
        {
            if (string.IsNullOrEmpty(stateCookie)) throw new Exception("客户端身份校验失败，Illegal Client Cerifcation");
            // 验证token是否有效
            JsonWebToken.Decode(stateCookie, "XB#4%", true);


            var parts = stateCookie.Split('.');
            //if (parts.Length != 3) throw new Exception("invalid Session Info!");
            var payload = parts[1];
            var payloadJson = Encoding.UTF8.GetString(Base64UrlDecode(payload));


            user = Newtonsoft.Json.JsonConvert.DeserializeObject<ISessionKey>(payloadJson);



        }

        private static byte[] Base64UrlDecode(string input)
        {
            var output = input;
            output = output.Replace('-', '+'); // 62nd char of encoding  
            output = output.Replace('_', '/'); // 63rd char of encoding  
            switch (output.Length % 4) // Pad with trailing '='s  
            {
                case 0: break; // No pad chars in this case  
                case 2: output += "=="; break; // Two pad chars  
                case 3: output += "="; break; // One pad char  
                default: throw new System.Exception("Illegal base64url string!");
            }
            var converted = Convert.FromBase64String(output); // Standard base64 decoder  
            return converted;
        }




        public static string CreateJWTToken(ISessionKey info)
        {
            return JsonWebToken.Encode(info, "XB#4%", JwtHashAlgorithm.RS256);
        }



        public static string CreateServerStateToken(ISessionKey info)
        {
            Database db = DataBaseManger.GetDB("");
            var token = Guid.NewGuid().ToString();
            // 这里要预留出pc端登陆的接口
            var clearSql = new Sql("delete from FBOnlineUser where uid=@0 and DeviceType='PC'", info.UserID);
            db.Execute(clearSql);

            var sql = new Sql("insert into FBOnlineUser(ID,UID,LoginIP,LoginMachine,State,CreateTime,UserToken,DeviceType) values(@0,@1,@2,@3,@4,@5,@0,@6)",
                token, info.UserID, info.IPAddress, WebHelper.GetMachineName(), "1", DateTime.Now.ToString(), "PC");
            db.Execute(sql);
            return token;
        }
    }
}
