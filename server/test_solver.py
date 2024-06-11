from solver import *

europe = ["Augsburg", "Munich", "Stuttgart", "Nuremberg", "Leipzig", "Dresden", "Berlin", "Hanover", "Bremen", "Hamburg", "Cologne", "Frankfurt"]
europeSmall = ["Augsburg", "Munich", "Stuttgart", "Nuremberg", "Leipzig", "Dresden", "Berlin"]

europeDistances = [[0,57,133,122,347,362,495,452,543,578,404,250],    # Augsburg
            [57,0,188,144,356,355,498,483,577,605,449,298],     # Munich
            [133,188,0,157,365,412,511,402,480,534,289,153],    # Stuttgart
            [122,144,157,0,225,258,374,338,433,461,337,187],    # Nuremberg
            [347,356,365,225,0,99,150,215,311,295,380,294],     # Leipzig
            [362,355,412,258,99,0,165,312,406,380,473,372],     # Dresden
            [495,498,511,374,150,165,0,250,316,255,477,422],    # Berlin
            [452,483,402,338,215,312,250,0,100,135,245,257],    # Hanover
            [543,577,480,433,311,406,316,100,0,95,270,330],     # Bremen
            [578,605,534,461,295,380,255,135,95,0,355,392],     # Hamburg
            [404,449,289,337,380,473,477,245,270,355,0,150],    # Cologne 
            [250,298,153,187,294,372,422,257,330,392,150,0]]    # Frankfurt

america = ['43 Inniscross Crescent', 'University of Toronto Scarborough', 'Oishiii Sweets Cafe', 'V1 hair salon']
americaDistances = [[0, 15083, 1320, 2836], 
                    [15088, 0, 13844, 13778], 
                    [1320, 13760, 0, 1513], 
                    [3350, 12360, 1603, 0]] 

def main():
    # print('------ Europe ------')
    # print(nearest_neighbor_solve(europe, europeDistances))
    # print(brute_force_solve(europeSmall, europeDistances))
    # print(nearest_neighbor_solve(europeSmall, europeDistances))
    print('----- America ------')
    print(brute_force_solve(america, americaDistances))
    print(nearest_neighbor_solve(america, americaDistances))


if __name__ == "__main__":
    main()
