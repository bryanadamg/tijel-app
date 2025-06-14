import os
import json
import discord
import requests
from bs4 import BeautifulSoup
from discord.ext import commands
from dotenv import load_dotenv

# Load .env variables
load_dotenv()

# Setup Discord bot
intents = discord.Intents.all()
bot = commands.Bot(command_prefix='!', intents=intents, help_command=None)

# Zodiac signs mapping
SIGNS = {
    "aries": 1,
    "taurus": 2,
    "gemini": 3,
    "cancer": 4,
    "leo": 5,
    "virgo": 6,
    "libra": 7,
    "scorpio": 8,
    "sagittarius": 9,
    "capricorn": 10,
    "aquarius": 11,
    "pisces": 12,
}


@bot.event
async def on_ready():
    print(f"✅ Logged in as {bot.user}")

@bot.command()
async def horoscope(ctx, sign: str):
    """Fetch today's horoscope for the given zodiac sign."""
    sign = sign.lower()
    if sign not in SIGNS:
        await ctx.send("Invalid sign. Please try again using a valid zodiac name.")
        return

    try:
        url = f"https://www.horoscope.com/us/horoscopes/general/horoscope-general-daily-today.aspx?sign={SIGNS[sign]}"
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        paragraph = soup.find("p")
        if paragraph:
            await ctx.send(paragraph.text.strip())
        else:
            await ctx.send("Couldn't fetch horoscope. Please try again later.")
    except Exception as e:
        await ctx.send(f"Error: {str(e)}")


bot.run(os.getenv("DISCORD_TOKEN"))
