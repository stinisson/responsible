"""
Starting out by following Raspberry Pi's temperature log tutorial
https://projects.raspberrypi.org/en/projects/temperature-log/
"""

from gpiozero import CPUTemperature
from time import sleep, strftime, time
import matplotlib.pyplot as plt


def write_temp(temp):
    with open("cpu_temp.csv", "a") as log:
        log.write("{0},{1}\n".format(strftime("%Y-%m-%d %H:%M:%S"), str(temp)))


def graph(x, y, temp):
    x.append(time())
    y.append(temp)
    plt.clf()
    plt.scatter(x, y)
    plt.plot(x, y)
    plt.pause(1)
    plt.savefig('cpu_temp.png')


def main():
    plt.ion()
    x = []
    y = []
    cpu = CPUTemperature()
    while True:
        temp = cpu.temperature
        graph(x, y, temp)
        write_temp(temp)
        sleep(1)


if __name__ == '__main__':
    main()
