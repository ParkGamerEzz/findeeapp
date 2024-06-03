
import aiohttp
import asyncio
import os

# Directory to save the downloaded images
output_dir = "./student_images"
os.makedirs(output_dir, exist_ok=True)

# Base URL for the images
base_url = "https://mas.acr.ac.th/mas.school/photo/"

# Asynchronous function to download an image for a given student ID
async def download_image(session, student_id):
    url = f"{base_url}{student_id}.jpg"
    async with session.get(url) as response:
        if response.status == 200:
            with open(f"{output_dir}/{student_id}.jpg", "wb") as file:
                file.write(await response.read())
            print(f"Downloaded: {student_id}.jpg")
        else:
            print(f"Failed to download: {student_id}.jpg")

async def main():
    async with aiohttp.ClientSession() as session:
        tasks = [download_image(session, student_id) for student_id in range(16000, 99999 + 1)]
        await asyncio.gather(*tasks)

# Run the asynchronous main function
if __name__ == "__main__":
    asyncio.run(main())
