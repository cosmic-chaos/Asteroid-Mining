import math

name_html=open('nametable.html','w+')
deltav_html=open('dvtable.html','w+')
a_html=open('atable.html','w+')
e_html=open('etable.html','w+')
i_html=open('itable.html','w+')
q_html=open('qtable.html','w+')
Q_html=open('bigqtable.html','w+')
diameter_html=open('diametertable.html','w+')

characteristics = open('results.csv','r')

a_list=list()

for line in characteristics:
    l=line.strip().split(',')
    name=l[0]
    a=float(l[2])
    e=float(l[1])
    i=float(l[4])*math.pi/180
    q=float(l[3])
    Q=float(l[5])
    if l[6]:
        diameter=float(l[6])
    else:
    	diameter=''

    probe_speed=7.8/29.785
    
    class Asteroid(object):
        def __init__(self,name,a,e,i,Q,q,diameter):
            self.name=name
            self.rank=0
            self.a=a
            self.e=e
            self.i=i
            self.fi=math.cos(self.i/2)
            self.Q=Q
            self.q=q
            self.diameter=diameter
            self.Atype=self.asteroid_type()
    
            self.ut_sq = self.ut_sq()
            self.uc_sq = self.uc_sq()
            self.ur_sq = self.ur_sq()

            self.dv= self.delta_v(probe_speed)
    
        def asteroid_type(self):
            if self.a<1:
                Atype='Aten'
            elif self.a>=1 and self.q<=1.017:
                Atype='Apollo'
            elif self.a>1 and self.q<=1.3 and self.q>1.017:
	        Atype='Amor'
            return Atype
        
        def uc_sq(self):
            if self.Atype is 'Aten':
	        uc_sq = 3/self.Q-1-2/self.Q*math.sqrt(2-self.Q)
            elif self.Atype is 'Apollo':
    	        uc_sq = 3/self.Q-2/(self.Q+1)-(2/self.Q)*math.sqrt(2/(self.Q+1))
            elif self.Atype is 'Amor':
	        uc_sq = 3/self.Q-2/(self.Q+1)-(2/self.Q)*math.sqrt(2/(self.Q+1)) * self.fi
            return uc_sq

        def ur_sq(self):
            if self.Atype is 'Aten' or self.Atype is 'Apollo':
	        ur_sq = 3/self.Q-1/self.a-(2/self.Q)*math.sqrt(self.a*(1-self.e**2)/Q) * self.fi
            elif self.Atype is 'Amor':
	        ur_sq = 3/self.Q-1/self.a-(2/self.Q)*math.sqrt(self.a*(1-self.e**2)/self.Q)
            return ur_sq

        def ut_sq(self):
            if self.Atype is 'Aten':
	        ut_sq = 2-2*math.sqrt(2*self.Q-self.Q**2 ) * self.fi
            elif self.Atype is 'Amor' or self.Atype is 'Apollo':
	        ut_sq = 3-2/(self.Q+1)-2*self.fi * math.sqrt(2*self.Q/(self.Q+1))
            return ut_sq
    
        def delta_v(self,probe_speed):
            UL = math.sqrt(self.ut_sq+2*probe_speed**2 )-probe_speed
            UR = math.sqrt(self.uc_sq-2*math.sqrt(self.ur_sq) * math.sqrt(self.uc_sq) * self.fi + self.ur_sq )
            
            F = UL+UR
            dv = 30*F+0.5
            return dv
            
    asteroid=Asteroid(name,a,e,i,Q,q,diameter)
    a_list.append(asteroid)

class HTML(object):
    def __init__(self,asteroid_list,html):
    	self.small_asteroids_list=list()
    	
        self.beggining='<html>\n<head>\n<link rel="stylesheet" type="text/css" media="screen" href="dvtable.css"/>\n<title>Mining Asteroids</title>\n</head>\n<body><h1>~ Asteroids Ranked by Suitability for Mining ~</h1>\n'
        self.js="""<script type='text/javascript'>
                \nfunction search(){
                var e = document.getElementById('search');
                location.assign('file:///C:/Users/Student/Desktop/Katya/Codes/Mining%20Asteroids/dvtable.html#'+e.value);}\n
                </script>"""
        self.search="""<div id="opacity">
                    <div id="inner">
                    <form method="POST" action="javascript:search()">
                    <span><b>Search for an asteroid:</b></span><br>
                    <input id="search" type="text">
                    <input type="submit" value="Search">
                    </form>"""
        self.table=self.table(asteroid_list)
        self.small_asteroids=self.small_asteroids()
        self.end='</body>\n</html>'
        
        self.write(html)
        
    def table(self,asteroid_list):
    	name_link=''
    	a_link=''
    	e_link=''
    	i_link=''
    	q_link=''
    	Q_link=''
    	dv_link=''
    	diameter_link=''
    	
    	if asteroid_list is name_sorted:
    	    name_link='id="clicked"'
    	elif asteroid_list is a_sorted:
    	    a_link='id="clicked"'
    	elif asteroid_list is e_sorted:
    	    e_link='id="clicked"'
    	elif asteroid_list is i_sorted:
    	    i_link='id="clicked"'
    	elif asteroid_list is q_sorted:
    	    q_link='id="clicked"'
    	elif asteroid_list is Q_sorted:
    	    Q_link='id="clicked"'
    	elif asteroid_list is deltav_sorted:
    	    dv_link='id="clicked"'
    	elif asteroid_list is diameter_sorted:
            diameter_link='id="clicked"'
    	
        make_table="""<table>\n
                   <tr style="background-color:black; color:white;">
                   <td><b>Rank</b></td>
                   <td><a """+name_link+"""class="table" href="nametable.html"><b>Asteroid</b></a></td>
                   <td><b>Type</b></td>
                   <td><a """+a_link+"""class="table" href="atable.html"><b>a (AU)</b></a></td>
                   <td><a """+e_link+"""class="table" href="etable.html"><b>e</b></a></td>
                   <td><a """+i_link+"""class="table" href="itable.html"><b>i (radians)</b></a></td>
                   <td><a """+q_link+"""class="table" href="qtable.html"><b>q (AU)</b></a></td>
                   <td><a """+Q_link+"""class="table" href="bigqtable.html"><b>Q (AU)</b></a></td>
                   <td><a """+dv_link+"""class="table" href="dvtable.html"><b>Delta V (km/s)</b></a></td>
                   <td><a """+diameter_link+"""class="table" href="diametertable.html"><b>Diameter (km)</b></a></td>
                   </tr>\n"""
        for asteroid in asteroid_list:
            if asteroid.diameter <= .025:
            	self.small_asteroids_list.append(asteroid.name)
                row='<tr style="background-color:#93F59E">'
            elif asteroid_list.index(asteroid)%2 != 0:
       	        row='<tr style="background-color:lightgrey">'
            else:
       	        row='<tr style="background-color:white">'
            make_table+=row+"""<td><A NAME='"""+str(asteroid.name)+"""'><b>"""+str(asteroid.rank)+"""</b></A></td>
                        <td><a target='_blank' href=
                        'orbit.html?a="""+str(asteroid.a)+"""+e="""+str(asteroid.e)+"""+i="""+str(asteroid.i)+"""+q="""+str(asteroid.q)+"""+Q="""+str(asteroid.Q)+"""+name="""+str(asteroid.name)+"""'>
                        """+str(asteroid.name)+"""</a></td>
                        <td>"""+str(asteroid.Atype)+"""</td><td>"""+str(asteroid.a)+"""</td>
                        <td>"""+str(asteroid.e)+"""</td>
                        <td>"""+str(asteroid.i)+"""</td>
                        <td>"""+str(asteroid.q)+"""</td>
                        <td>"""+str(asteroid.Q)+"""</td>
                        <td>"""+str(asteroid.dv)+"""</td>
                        <td>"""+str(asteroid.diameter)+"""</td>
                        </tr>\n"""
        make_table+='</table>\n'
        return make_table
        
    def small_asteroids(self):
    	make_small_asteroids='<span><b>Asteroids with diameter equal to or under 0.025 km:</b></span><br>\n<span style="color:#93F59E">(Highlighted in green on the table)<span>'
    	for asteroid in self.small_asteroids_list:
    	    make_small_asteroids+='<br><li><A HREF="#'+str(asteroid)+'">'+str(asteroid)+'</A></li>'
    	make_small_asteroids+='</ul></div></div>\n<br>\n'
        return make_small_asteroids
    
    def write(self,f):
        f.write(self.beggining)
        f.write(self.js)
        f.write(self.search)
        f.write(self.small_asteroids)
        f.write(self.table)
        f.write(self.end)

name_sorted = sorted(a_list, key=lambda asteroid: asteroid.name)
deltav_sorted = sorted(a_list, key=lambda asteroid: asteroid.dv)
a_sorted = sorted(a_list, key=lambda asteroid: asteroid.a)
e_sorted = sorted(a_list, key=lambda asteroid: asteroid.e)
i_sorted = sorted(a_list, key=lambda asteroid: asteroid.i)
q_sorted = sorted(a_list, key=lambda asteroid: asteroid.q)
Q_sorted = sorted(a_list, key=lambda asteroid: asteroid.Q)
diameter_sorted = sorted(a_list, key=lambda asteroid: asteroid.diameter)

for asteroid in deltav_sorted:
    asteroid.rank=deltav_sorted.index(asteroid)+1

HTML(name_sorted,name_html)
HTML(deltav_sorted,deltav_html)
HTML(a_sorted,a_html)
HTML(e_sorted,e_html)
HTML(i_sorted,i_html)
HTML(q_sorted,q_html)
HTML(Q_sorted,Q_html)
HTML(diameter_sorted,diameter_html)

name_html.close()
deltav_html.close()
a_html.close()
e_html.close()
i_html.close()
q_html.close()
Q_html.close()
diameter_html.close()
characteristics.close()