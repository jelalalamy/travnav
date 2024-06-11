import os, requests
from os.path import join, dirname
from dotenv import load_dotenv
from goog import computeRouteMatrix

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

def main():
  placeIds = ['43 Inniscross Crescent, Scarborough, ON M1V 2S8, Canada', 
              '3376 Kennedy Rd Unit 2, Scarborough, ON M1V 3S8, Canada', 
              '105-3700 Midland Ave, Scarborough, ON M1V 0B4, Canada', 
              '1265 Military Trail, Scarborough, ON M1C 1A4, Canada']
  res = computeRouteMatrix(placeIds)
  print(res)

if __name__ == "__main__":
  main()