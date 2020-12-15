from gpiozero import CPUTemperature
from time import sleep, strftime, time
import matplotlib.pyplot as plt


def write_temp(temp):
    with open("cpu_temp.csv", "a") as log:
        log.write("{0},{1}\n".format(strftime("%Y-%m-%d %H:%M:%S"), str(temp)))


def graph(temp):
    plt.ion()
    x = []
    y = []
    x.append(time())
    y.append(temp)
    plt.clf()
    plt.scatter(x, y)
    plt.plot(x, y)
    plt.pause(1)
    plt.savefig('cpu_temp.png')


def main():
    print("henlo")
    cpu = CPUTemperature()
    while True:
        temp = cpu.temperature
        graph(temp)
        print(temp)
        write_temp(temp)
        sleep(1)


if __name__ == '__main__':
    main()
