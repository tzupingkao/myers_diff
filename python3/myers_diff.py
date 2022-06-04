from __future__ import print_function
from collections import namedtuple
import sys

Keep = namedtuple('Keep', ['line'])
Insert = namedtuple('Insert', ['line'])
Remove = namedtuple('Remove', ['line'])
Frontier = namedtuple('Frontier', ['x', 'history'])


def myers_diff(old_lines, new_lines):
    def one(idx):
        return idx - 1

    # V為一個Dict，index存放k值，value存放此k值可走到的最遠x座標
    # 使用Dict原因是k值有可能是負數，如果用array會錯誤
    V = {1: 0}

    # frontier為一個Dict，index存放k值
    # value是一個Dict，index是此k值可走到的最遠x座標
    # history是走到此x座標之前已經經歷過的操作步驟
    frontier = {1: Frontier(0, [])}

    # old_max 與 new_max 分別為兩個檔案的行數
    old_max = len(old_lines)
    new_max = len(new_lines)

    # d 為edit graph要走的步驟數，依照演算法最多就是 N + M 個步驟
    for d in range(0, old_max + new_max + 1):
        # k值的範圍[-d, d]，每次加2
        for k in range(-d, d + 1, 2):
            # 推估上一個步驟是 往右走 or 往下走
            # 條件如下
            #
            # 1. k == -d
            #    理由: 此時一定在編輯圖的最左的邊上，因為只能往右走或往下走，因此上一部一定是往下走
            #
            #    or
            #
            # 2. k != d and V[k + 1] > V[k - 1]
            #    理由: 此時不在編輯圖的最左的邊上
            #         k + 1代表上一步驟往下走 (思考: 上一個步驟為k1，當前步驟為k2，因此往下走就是k2 = k1-1，k1 = k2+1)
            #         k - 1代表上一步驟往右走 (思考: 上一個步驟為k1，當前步驟為k2，因此往右走就是k2 = k1+1，k1 = k2-1)
            #         依據Greedy Algorithm的原則
            #         V[k + 1] > V[k - 1] 代表上一個步驟往下走可以走到最遠的x座標
            down = (k == -d or (k != d and V[k + 1] > V[k - 1]))
            if down:
                # k + 1代表上一步驟往下走 (思考: 上一個步驟為k1，當前步驟為k2，因此往下走就是k2 = k1-1，k1 = k2+1)
                kPrev = k + 1
            else:
                # k - 1代表上一步驟往右走 (思考: 上一個步驟為k1，當前步驟為k2，因此往右走就是k2 = k1+1，k1 = k2-1)
                kPrev = k - 1

            # xStart, yStart: 前一個步驟的(x, y)座標位置
            xStart = V[kPrev]
            yStart = xStart - kPrev
            # 取出前一個步驟的history
            # 就是走到此x座標之前已經經歷過的操作步驟
            old_x, history = frontier[kPrev]
            history = history[:]

            # xMid, yMid: 當前步驟的(x, y)座標位置
            if down:
                xMid = xStart
            else:
                xMid = xStart + 1
            yMid = xMid - k

            if 1 <= yMid <= new_max and down:
                # 如果前一個步驟往下走
                # 且 當前的座標位置yMid超過1
                # 代表前一個步驟 到 當前的步驟 經過了一次Insert的動作
                # 因此把前一個步驟的history多加入一次Insert的操作
                history.append(Insert(new_lines[one(yMid)]))
            elif 1 <= xMid <= old_max:
                # 如果前一個步驟往右走
                # 且 當前的座標位置xMid超過1
                # 代表前一個步驟 到 當前的步驟 經過了一次Remove的動作
                # 因此把前一個步驟的history多加入一次Remove的操作
                history.append(Remove(old_lines[one(xMid)]))

            xEnd = xMid
            yEnd = yMid

            while xEnd < old_max and yEnd < new_max and old_lines[xEnd] == new_lines[yEnd]:
                # 如果
                # 當前步驟的x座標對應出的 old file的字串
                # 相等於
                # 當前步驟的y座標對應出的 new file的字串
                # 代表出現 edit graph 中的斜線狀況
                #
                # 此時把前一個步驟的history多加入一次Keep的操作
                # 並且把(x, y)座標都往上加一，在下一次的迴圈檢查是否有斜線的狀況

                xEnd += 1
                yEnd += 1
                history.append(Keep(old_lines[one(xEnd)]))

            # 把最後的 x 座標設定給 V[k]
            V[k] = xEnd

            if xEnd >= old_max and yEnd >= new_max:
                # 此條件發生時，代表 edit graph已經走到結束點
                # 將history 回傳就可以得知所有的操作紀錄
                return history
            else:
                # edit graph尚未走到結束點
                # 將history 記錄回frontier參數可以
                frontier[k] = Frontier(xEnd, history)

    assert False, 'Could not find edit script'


# -A
# -B
#  C
# +B
#  A
#  B
# -B
#  A
# +C

def main():
    try:
        _, old_file, new_file = sys.argv
    except ValueError:
        print(sys.argv[0], '<Old FILE>', '<New FILE>')
        return 1

    with open(old_file) as old_handle:
        old_lines = [line.rstrip() for line in old_handle]

    with open(new_file) as new_handle:
        new_lines = [line.rstrip() for line in new_handle]

    diff = myers_diff(old_lines, new_lines)
    for elem in diff:
        if isinstance(elem, Keep):
            print(' ' + elem.line)
        elif isinstance(elem, Insert):
            print('+' + elem.line)
        else:
            print('-' + elem.line)


if __name__ == '__main__':
    sys.exit(main())
