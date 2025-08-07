# เลือก base image ที่เหมาะกับ Node.js เวอร์ชันที่ต้องการ
FROM node:20-alpine

# ตั้ง working directory
WORKDIR /app

# คัดลอกไฟล์ package.json และ package-lock.json
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกไฟล์แอปทั้งหมด
COPY . .

# build แอป (ถ้าใช้ Nuxt หรือ framework อื่นที่ต้อง build)
RUN npm run build

# expose port ที่แอปจะรัน (Fly.io จะใช้ port นี้)
EXPOSE 3000

# คำสั่งรันแอป (ปรับตามแอปจริง)
CMD ["npm", "start"]
