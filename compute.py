import numpy as np

m1 = 10
m2 = 20
m3 = 30

p1_start = np.array([-10, 10, -11])
v1_start = np.array([-3, 0, 0])

p2_start = np.array([0, 0, 0])
v2_start = np.array([0, 0, 0])

p3_start = np.array([10, 10, 12])
v3_start = np.array([3, 0, 0])

def deriv(p1, p2, p3):
    global m1,m2,m3
    p1dot = -9.8 * m2 * (p1 - p2)/(np.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2 + (p1[2] - p2[2])**2)**3) - \
		       9.8 * m3 * (p1 - p3)/(np.sqrt((p1[0] - p3[0])**2 + (p1[1] - p3[1])**2 + (p1[2] - p3[2])**2)**3)

    p2dot = -9.8 * m3 * (p2 - p3)/(np.sqrt((p2[0] - p3[0])**2 + (p2[1] - p3[1])**2 + (p2[2] - p3[2])**2)**3) - \
		       9.8 * m1 * (p2 - p1)/(np.sqrt((p2[0] - p1[0])**2 + (p2[1] - p1[1])**2 + (p2[2] - p1[2])**2)**3)

    p3dot = -9.8 * m1 * (p3 - p1)/(np.sqrt((p3[0] - p1[0])**2 + (p3[1] - p1[1])**2 + (p3[2] - p1[2])**2)**3) - \
		       9.8 * m2 * (p3 - p2)/(np.sqrt((p3[0] - p2[0])**2 + (p3[1] - p2[1])**2 + (p3[2] - p2[2])**2)**3)

    return p1dot, p2dot, p3dot

# parameters
dt = 0.001
steps = 200000

# initialize trajectory array
p1 = np.array([[0.,0.,0.] for i in range(steps)])
v1 = np.array([[0.,0.,0.] for i in range(steps)])

p2 = np.array([[0.,0.,0.] for j in range(steps)])
v2 = np.array([[0.,0.,0.] for j in range(steps)])

p3 = np.array([[0.,0.,0.] for k in range(steps)])
v3 = np.array([[0.,0.,0.] for k in range(steps)])

# starting point and velocity
p1[0], p2[0], p3[0] = p1_start, p2_start, p3_start

v1[0], v2[0], v3[0] = v1_start, v2_start, v3_start

# evolution of the system
for i in range(steps-1):
	# calculate derivatives
	dv1, dv2, dv3 = deriv(p1[i], p2[i], p3[i])

	v1[i + 1] = v1[i] + dv1 * dt
	v2[i + 1] = v2[i] + dv2 * dt
	v3[i + 1] = v3[i] + dv3 * dt

	p1[i + 1] = p1[i] + v1[i] * dt
	p2[i + 1] = p2[i] + v2[i] * dt
	p3[i + 1] = p3[i] + v3[i] * dt
sl = 100 # slice 
strp = lambda x: f"[{x[0]},{x[1]},{x[2]}]"
with open("data.js","w+") as f:
      f.write(f"export const max={steps};\nexport const sl={sl};\nexport const p1=[{','.join(map(strp,p1[::sl]))}];\nexport const p2=[{','.join(map(strp,p2[::sl]))}];\nexport const p3=[{','.join(map(strp,p3[::sl]))}];")

