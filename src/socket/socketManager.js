import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import {envConfig}from '../libs/env.js';
export const registerSocketHandlers = (io) => {
    const adminNsp = io.of('/admin')
    adminNsp.use((socket, next)=>{
        const tokenHeader = socket.handshake.headers.cookie
        if(!tokenHeader) return next(new Error("Authentication error")
        )
        const cookies = cookie.parse(tokenHeader)
        const token = cookies['ident']
        if(!token){
            return next(new Error("Authentication error"))
        }
        const decodedToken =   jwt.verify(token, envConfig.JWT_SECRET) // In real scenario, decode and verify the token
        if(!decodedToken){
        return next(new Error("Authentication error"))
        }
        console.log("Decoded Token Socket:", decodedToken);
        socket.user = decodedToken
        // Here you would normally verify the token
        // For demonstration, we'll assume any token is valid
        next()

    })
    adminNsp.on("connection", (socket)=>{
        console.log("New admin client connected", socket.user);
        socket.on("admin-room", (data)=>{
            console.log("Admin joined room:", data);
            socket.join(data)
            // socket.join(data.roomId)
        })
       
      

        
        
      



         socket.on("disconnect", ()=>{
            console.log("Admin client disconnected");
        })
    
    
    
    })
       
 
}